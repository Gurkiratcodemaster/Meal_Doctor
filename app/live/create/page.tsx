"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { motion } from "framer-motion";
import { ArrowLeft, Video } from "lucide-react";
import Button from "@/app/components/Button";

export default function CreateLiveSessionPage() {
  const { user, isAuthenticated, isProfessional } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isProfessional) {
      router.push("/live");
      return;
    }
  }, [isAuthenticated, isProfessional, router]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      // Load existing sessions
      const stored = localStorage.getItem("meal_doctor_live_sessions");
      const sessions = stored ? JSON.parse(stored) : [];

      // Create new session
      const newSession = {
        id: `live_${Date.now()}`,
        hostId: user.id,
        title: title.trim(),
        description: description.trim(),
        isActive: true,
        participants: user.id,
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Add to sessions
      sessions.unshift(newSession);
      localStorage.setItem("meal_doctor_live_sessions", JSON.stringify(sessions));

      // Redirect to the new session
      router.push(`/live/${newSession.id}`);
    } catch (err) {
      setError("Failed to create session. Please try again.");
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isProfessional) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Video className="w-6 h-6 text-green-500" />
              Start Live Session
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
        >
          <form onSubmit={handleCreateSession} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Understanding Macronutrients"
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will you cover in this session?"
                rows={5}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white resize-none"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm text-green-400">
                💡 <strong>Tip:</strong> Keep your title concise and descriptive. 
                In the description, outline what participants will learn.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold"
              >
                {loading ? "Starting..." : "Go Live"}
              </Button>
            </div>
          </form>
        </motion.div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Note: This is a simulated live session for prototype purposes</p>
        </div>
      </div>
    </div>
  );
}
