"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { AuthService } from "@/app/lib/services/auth";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Send,
  Maximize,
  Volume2,
  VolumeX,
  MessageCircle,
} from "lucide-react";

interface LiveSession {
  id: string;
  hostId: string;
  title: string;
  description: string;
  isActive: boolean;
  participants: string;
  startedAt: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

export default function LiveSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const sessionId = params.id as string;

  const [session, setSession] = useState<LiveSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadSession();
    loadMessages();
  }, [sessionId, isAuthenticated, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSession = () => {
    const stored = localStorage.getItem("meal_doctor_live_sessions");
    if (!stored) return;

    const sessions: LiveSession[] = JSON.parse(stored);
    const foundSession = sessions.find((s) => s.id === sessionId);
    
    if (!foundSession) {
      router.push("/live");
      return;
    }

    setSession(foundSession);

    // Add current user to participants if not already
    if (user && !foundSession.participants.includes(user.id)) {
      const updatedSession = {
        ...foundSession,
        participants: foundSession.participants
          ? `${foundSession.participants},${user.id}`
          : user.id,
      };

      const updatedSessions = sessions.map((s) =>
        s.id === sessionId ? updatedSession : s
      );

      localStorage.setItem("meal_doctor_live_sessions", JSON.stringify(updatedSessions));
      setSession(updatedSession);
    }
  };

  const loadMessages = () => {
    const stored = localStorage.getItem(`meal_doctor_session_chat_${sessionId}`);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      // Initialize with welcome message
      const welcomeMsg: ChatMessage = {
        id: "welcome",
        userId: "system",
        username: "System",
        message: "Welcome to the live session! Feel free to ask questions.",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  };

  const saveMessages = (msgs: ChatMessage[]) => {
    localStorage.setItem(`meal_doctor_session_chat_${sessionId}`, JSON.stringify(msgs));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      username: `${user.firstName} ${user.lastName}`,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, msg];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setNewMessage("");
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getParticipants = () => {
    if (!session) return [];
    return session.participants
      .split(",")
      .filter((p) => p.trim())
      .map((id) => AuthService.getUserById(id))
      .filter((u) => u !== null);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const host = AuthService.getUserById(session.hostId);
  const participants = getParticipants();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/live")}
              className="p-2 hover:bg-white/5 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold">{session.title}</h1>
              {host && (
                <p className="text-sm text-gray-400">
                  Hosted by {host.firstName} {host.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">LIVE</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full text-sm">
              <Users className="w-4 h-4" />
              {participants.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-80px)] flex gap-4">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center relative overflow-hidden border border-white/10">
            {/* Simulated video placeholder */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                {host && (
                  <img
                    src={host.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${host.username}`}
                    alt={host.firstName}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <p className="text-xl font-semibold text-white">
                {host?.firstName} {host?.lastName}
              </p>
              <p className="text-gray-400">{host?.specialization}</p>
              <p className="text-sm text-gray-500 mt-4">
                Live video stream simulation
              </p>
            </div>

            {/* Video controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-3 bg-black/50 hover:bg-black/70 rounded-full transition backdrop-blur-sm"
                >
                  {muted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-3 bg-black/50 hover:bg-black/70 rounded-full transition backdrop-blur-sm"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          {/* Chat header */}
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              Live Chat
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  msg.userId === "system" ? "text-center" : ""
                }`}
              >
                {msg.userId === "system" ? (
                  <p className="text-sm text-gray-500 italic">{msg.message}</p>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-green-400">
                        {msg.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 mt-1">{msg.message}</p>
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-green-500 text-black rounded-full hover:bg-green-600 transition disabled:opacity-50 disabled:hover:bg-green-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
