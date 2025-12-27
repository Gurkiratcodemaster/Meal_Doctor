"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers/AuthProvider";
import { AuthService, User } from "../lib/services/auth";
import { DataService, Message, Conversation } from "../lib/services/data";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  ArrowLeft, 
  Search,
  CheckCheck,
  Check,
  IndianRupee
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ConversationWithUser extends Conversation {
  user: User;
}

export default function MessagesPage() {
  const { user: currentUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadConversations();
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Handle query parameter for starting a conversation
    const userId = searchParams.get('user');
    if (userId && conversations.length > 0 && !selectedConversation) {
      const existingConvo = conversations.find(c => c.userId === userId);
      if (existingConvo) {
        setSelectedConversation(existingConvo);
      } else {
        // Create a new conversation with this user
        const user = AuthService.getUserById(userId);
        if (user) {
          const newConvo: ConversationWithUser = {
            userId: user.id,
            user: user as User,
            lastMessage: {
              id: '',
              senderId: '',
              receiverId: '',
              content: 'Start a conversation',
              createdAt: new Date().toISOString(),
              read: true
            },
            unreadCount: 0
          };
          setSelectedConversation(newConvo);
          setMessages([]);
        }
      }
    }
  }, [searchParams, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.userId);
      // Mark messages as read
      DataService.markMessagesAsRead(currentUser!.id, selectedConversation.userId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = () => {
    if (!currentUser) return;
    
    const convos = DataService.getConversations(currentUser.id);
    const convosWithUsers: ConversationWithUser[] = convos
      .map((convo) => {
        const user = AuthService.getUserById(convo.userId);
        if (!user) return null;
        return { ...convo, user };
      })
      .filter((c) => c !== null) as ConversationWithUser[];
    
    setConversations(convosWithUsers);
    setLoading(false);
  };

  const loadMessages = (otherUserId: string) => {
    if (!currentUser) return;
    const msgs = DataService.getMessagesBetween(currentUser.id, otherUserId);
    setMessages(msgs);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedConversation) return;

    const msg = DataService.sendMessage(
      currentUser.id,
      selectedConversation.userId,
      newMessage.trim()
    );

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    
    // Refresh conversations to update last message
    loadConversations();
  };

  const handleSelectConversation = (convo: ConversationWithUser) => {
    setSelectedConversation(convo);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((c) =>
    c.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Conversations List */}
        <div
          className={`${
            selectedConversation ? "hidden md:flex" : "flex"
          } flex-col w-full md:w-96 border-r border-white/10`}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="w-7 h-7 text-green-500" />
              Messages
            </h1>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400">No conversations yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Start chatting with professionals from the Explore page
                </p>
              </div>
            ) : (
              filteredConversations.map((convo) => (
                <motion.div
                  key={convo.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleSelectConversation(convo)}
                  className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition ${
                    selectedConversation?.userId === convo.userId ? "bg-white/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={convo.user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${convo.user.username}`}
                      alt={convo.user.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {convo.user.firstName} {convo.user.lastName}
                          {convo.user.role === "professional" && convo.user.consultationPrice && (
                            <span className="ml-2 text-xs text-green-400 inline-flex items-center">
                              <IndianRupee className="w-3 h-3" />
                              {convo.user.consultationPrice}
                            </span>
                          )}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatTime(convo.lastMessage.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 truncate">
                          {convo.lastMessage.senderId === currentUser.id && "You: "}
                          {convo.lastMessage.content}
                        </p>
                        {convo.unreadCount > 0 && (
                          <span className="ml-2 bg-green-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${
            selectedConversation ? "flex" : "hidden md:flex"
          } flex-col flex-1`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="md:hidden p-2 hover:bg-white/5 rounded-full transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedConversation.user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.user.username}`}
                  alt={selectedConversation.user.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-semibold">
                    {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {selectedConversation.user.role === "professional"
                      ? selectedConversation.user.specialization || "Professional"
                      : "User"}
                  </p>
                </div>
                {selectedConversation.user.role === "professional" && selectedConversation.user.consultationPrice && (
                  <div className="text-sm text-green-400 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    <span>{selectedConversation.user.consultationPrice}/session</span>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                  const isCurrentUser = msg.senderId === currentUser.id;
                  const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                    >
                      {showAvatar && !isCurrentUser && (
                        <img
                          src={selectedConversation.user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.user.username}`}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      {!showAvatar && !isCurrentUser && <div className="w-8" />}
                      
                      <div
                        className={`max-w-[70%] ${
                          isCurrentUser
                            ? "bg-green-500 text-black"
                            : "bg-white/10 text-white"
                        } rounded-2xl px-4 py-2`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs ${
                            isCurrentUser ? "text-black/70 justify-end" : "text-gray-400"
                          }`}
                        >
                          <span>{formatTime(msg.createdAt)}</span>
                          {isCurrentUser && (
                            msg.read ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-green-500 text-black rounded-full hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageCircle className="w-20 h-20 mb-4" />
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
