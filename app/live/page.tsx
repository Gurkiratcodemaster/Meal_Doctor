"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { AuthService } from "../lib/services/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Video,
  Users,
  Clock,
  Play,
  ArrowLeft,
  Plus,
  RadioTower,
} from "lucide-react";
import Link from "next/link";
import liveSessionsData from "@/data/liveSessions.json";

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

export default function LiveSessionsPage() {
  const { user, isAuthenticated, isProfessional } = useAuth();
  const router = useRouter();
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadSessions();
  }, [isAuthenticated, router]);

  const loadSessions = () => {
    setLoading(true);
    // Load from localStorage or use default data
    const stored = localStorage.getItem("meal_doctor_live_sessions");
    if (stored) {
      setLiveSessions(JSON.parse(stored));
    } else {
      setLiveSessions(liveSessionsData);
      localStorage.setItem("meal_doctor_live_sessions", JSON.stringify(liveSessionsData));
    }
    setLoading(false);
  };

  const getParticipantCount = (participants: string) => {
    if (!participants) return 0;
    return participants.split(",").filter((p) => p.trim()).length;
  };

  const getHost = (hostId: string) => {
    return AuthService.getUserById(hostId);
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffMs / 86400000);
    return `${diffDays}d ago`;
  };

  const handleJoinSession = (sessionId: string) => {
    router.push(`/live/${sessionId}`);
  };

  const handleCreateSession = () => {
    router.push("/live/create");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const activeSessions = liveSessions.filter((s) => s.isActive);
  const pastSessions = liveSessions.filter((s) => !s.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/5 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Video className="w-6 h-6 text-green-500" />
                Live Sessions
              </h1>
            </div>
          </div>

          {isProfessional && (
            <button
              onClick={handleCreateSession}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-full transition"
            >
              <Plus className="w-4 h-4" />
              Start Live
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Active Sessions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <RadioTower className="w-6 h-6 text-red-500 animate-pulse" />
            Live Now
          </h2>

          {activeSessions.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No live sessions at the moment</p>
              <p className="text-sm text-gray-500 mt-2">
                Check back later or browse past sessions
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {activeSessions.map((session) => {
                const host = getHost(session.hostId);
                const participantCount = getParticipantCount(session.participants);

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-sm border border-red-500/50 rounded-xl p-6 hover:border-red-500 transition relative overflow-hidden"
                  >
                    {/* Live indicator */}
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      LIVE
                    </div>

                    <div className="mb-4">
                      {host && (
                        <Link href={`/profile/${host.username}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <img
                              src={host.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${host.username}`}
                              alt={host.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-white hover:text-green-400 transition">
                                {host.firstName} {host.lastName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {host.specialization}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )}

                      <h3 className="text-lg font-bold text-white mb-2 pr-16">
                        {session.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {session.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {participantCount} watching
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Started {formatTime(session.startedAt)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinSession(session.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
                      >
                        <Play className="w-4 h-4" />
                        Join Session
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Past Sessions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pastSessions.map((session) => {
                const host = getHost(session.hostId);
                const participantCount = getParticipantCount(session.participants);

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition"
                  >
                    <div>
                      {host && (
                        <Link href={`/profile/${host.username}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <img
                              src={host.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${host.username}`}
                              alt={host.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-white hover:text-green-400 transition">
                                {host.firstName} {host.lastName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {host.specialization}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )}

                      <h3 className="text-lg font-bold text-white mb-2">
                        {session.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {session.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {participantCount} attended
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(session.startedAt)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
