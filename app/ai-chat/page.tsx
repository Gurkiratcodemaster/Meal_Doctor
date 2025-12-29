"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User } from "lucide-react";

import { useAuth } from "../providers/AuthProvider";
import { chatWithAI } from "../actions/ai";
import TransButton from "../components/Button";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
}

export default function AIChatPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ----------------------------- Auth Guard ----------------------------- */
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  /* -------------------------- Auto Scroll Down -------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ----------------------------- Send Message ---------------------------- */
  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: input.trim(),
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const aiReply = await chatWithAI(userMessage.content);

        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: aiReply,
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "⚠️ Sorry, something went wrong while generating the response.",
            createdAt: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ------------------------------ Header ------------------------------ */}
      <header className="sticky top-0 z-50 border-b border-black">
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text- font-bold flex items-center gap-2">
                AI Diet Assistant
              </h1>
              <p className="text-xs text-gray-400">
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ----------------------------- Messages ------------------------------ */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-green-500 to-green-700"
                      : "bg-gradient-to-br from-blue-500 to-blue-700"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                <div className="max-w-[80%]">
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === "assistant"
                        ? "bg-white/5 border border-white/10"
                        : "bg-green-500 text-black"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150" />
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* ------------------------------- Input ------------------------------- */}
      <footer className="sticky bottom-0 border-t border-white/10 backdrop-blur-xl">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto px-4 py-4 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about nutrition, meals, or health…"
            className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-full bg-green-500 text-black hover:bg-green-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center pb-3">
          AI responses are for general guidance only.
        </p>
      </footer>
    </div>
  );
}
