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
  Video,
  Bot,
  Plus,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";
import Post from "@/app/components/Post";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isProfessional } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    followers: 0,
    following: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isProfessional) {
      router.push("/dashboard/user");
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, isAuthenticated, isProfessional, router]);

  const loadData = () => {
    if (!user) return;

    // Get user's posts
    const userPosts = DataService.getPostsByAuthor(user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const postsWithAuthor = userPosts.map((post) => ({
      ...post,
      author: user,
    }));

    setPosts(postsWithAuthor);

    setStats({
      totalPosts: userPosts.length,
      followers: user.followers || 0,
      following: user.following || 0,
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
            <Link href="/dashboard/admin">
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
          <h2 className="text-3xl font-bold text-white mb-2">Professional Dashboard</h2>
          <p className="text-gray-400">Manage your content and engage with your audience</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.firstName}
                className="w-24 h-24 rounded-full border-4 border-green-500 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-400">@{user.username}</p>
              {user.specialization && (
                <p className="text-green-400 font-medium mt-1">{user.specialization}</p>
              )}
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
                  <span className="font-bold text-white">{stats.totalPosts}</span>
                  <span className="text-gray-400 ml-1">Posts</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/admin/edit"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/live/create">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition">
                    <Video className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Start Live</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Host a live session with your followers
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/messages">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition">
                    <MessageCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Messages</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Chat with your clients and followers
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href={`/profile/${user.username}`}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition">
                    <User className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">View Profile</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  See your public profile page
                </p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-400" />
              Your Posts
            </h3>
            <span className="text-gray-400 text-sm">{posts.length} total</span>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">You haven't created any posts yet</p>
              <p className="text-sm text-gray-500">
                Share your expertise and connect with your audience
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Post key={post.id} post={post} author={post.author} />
              ))}
            </div>
          )}
        </motion.div>

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
