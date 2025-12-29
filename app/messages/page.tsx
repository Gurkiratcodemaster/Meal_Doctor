"use client";

import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const conversations = [
  {
    id: 1,
    name: "Dr. Sarah Lee",
    role: "Nutritionist",
    messages: [
      { fromMe: false, text: "Hi! How can I improve my diet routine?" },
      { fromMe: true, text: "I want a sustainable daily plan." },
      { fromMe: false, text: "Start with balanced meals and consistent timing." },
    ],
  },
  {
    id: 2,
    name: "Coach Ryan",
    role: "Fitness Coach",
    messages: [
      { fromMe: false, text: "Diet works best with simple habits." },
      { fromMe: true, text: "Any beginner tips?" },
    ],
  },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <main
      className="
        min-h-screen
        bg-gray-50 dark:bg-black
        md:pl-20 lg:pl-56
        flex
      "
    >
      {/* Conversation List */}
      <aside
        className="
          w-80
          border-r border-black/15 dark:border-green-500/20
          bg-white dark:bg-zinc-950
          hidden md:flex flex-col
        "
      >
        <div className="p-4 border-b border-black/15 dark:border-green-500/20">
          <h2 className="text-xl font-bold text-black dark:text-green-500">
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChat(c)}
              className={`
                w-full text-left p-4 transition
                ${
                  activeChat.id === c.id
                    ? "bg-black/10 dark:bg-green-500/20"
                    : "hover:bg-black/10 dark:hover:bg-black/30"
                }
              `}
            >
              <p className="font-semibold text-black dark:text-green-400">
                {c.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-green-400/60">
                {c.role}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className="
            p-4 border-b border-black/15 dark:border-green-500/20
            bg-white dark:bg-zinc-950
          "
        >
          <p className="font-semibold text-black dark:text-green-400">
            {activeChat.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-green-400/60">
            {activeChat.role}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {activeChat.messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-xs px-4 py-2 rounded-2xl text-sm
                  ${
                    msg.fromMe
                      ? "bg-black text-white dark:bg-green-500 dark:text-black"
                      : "bg-black/10 dark:bg-white/10 text-black dark:text-green-300"
                  }
                `}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newMessage.trim()) return;
            activeChat.messages.push({ fromMe: true, text: newMessage });
            setNewMessage("");
          }}
          className="
            p-4 border-t border-black/15 dark:border-green-500/20
            bg-white dark:bg-zinc-950
            flex gap-2
          "
        >
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="
              flex-1 px-4 py-3 rounded-full
              bg-black/10 dark:bg-white/10
              text-black dark:text-green-400
              focus:outline-none
            "
          />
          <button
            className="
              p-3 rounded-full
              bg-black text-white
              dark:bg-green-500 dark:text-black
              hover:scale-105 transition
            "
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </section>

      {/* Mobile Empty State */}
      <div className="md:hidden flex-1 flex items-center justify-center text-gray-400">
        <MessageCircle className="w-16 h-16" />
      </div>
    </main>
  );
}
