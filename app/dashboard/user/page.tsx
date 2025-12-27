"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { DataService } from "@/app/lib/services/data";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  User,
  Edit,
  LogOut,
  Home,
  Compass,
  MessageCircle,
  Bell,
  UserPlus,
  Video,
  Bot,
} from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    following: 0,
    followers: 0,
    likedPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      loadStats();
    }
  }, [user, isAuthenticated, router]);

  const loadStats = () => {
    if (!user) return;

    setStats({
      following: user.following || 0,
      followers: user.followers || 0,
      likedPosts: 0, // Simplified for prototype
    });

    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-white">
              Meal<span className="text-green-400">Doctor</span>
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/feed">
              <Home className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/explore">
              <Compass className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/live">
              <Video className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/messages">
              <MessageCircle className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/ai-chat">
              <Bot className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/notifications">
              <Bell className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/dashboard/user">
              <User className="w-6 h-6 text-green-400" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Your Dashboard</h2>
          <p className="text-gray-400">Manage your profile and activity</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt={user.firstName}
              className="w-24 h-24 rounded-full border-4 border-green-500 object-cover"
            />

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-400">@{user.username}</p>
              {user.bio && <p className="text-gray-300 mt-2">{user.bio}</p>}

              <div className="flex flex-wrap gap-6 mt-4">
                <div>
                  <span className="font-bold text-white">{stats.followers}</span>
                  <span className="text-gray-400 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-white">{stats.following}</span>
                  <span className="text-gray-400 ml-1">Following</span>
                </div>
                <div>
                  <span className="font-bold text-white">{stats.likedPosts}</span>
                  <span className="text-gray-400 ml-1">Liked Posts</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/user/edit"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/explore">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition">
                    <UserPlus className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Find Professionals</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Discover and follow verified nutrition professionals
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/ai-chat">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition">
                    <Bot className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">AI Diet Assistant</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Get instant nutrition advice and personalized tips
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/live">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition">
                    <Video className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Join Live Sessions</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Attend interactive sessions with nutrition experts
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/messages">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition">
                    <MessageCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Your Messages</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Chat with professionals about your nutrition goals
                </p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition mx-auto"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  );
}
