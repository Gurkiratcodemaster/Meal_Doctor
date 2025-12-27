"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { DataService } from "@/app/lib/services/data";
import { AuthService } from "@/app/lib/services/auth";
import Post from "@/app/components/Post";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Compass, MessageCircle, Bell, User, Video, Bot } from "lucide-react";

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadFeed();
    }
  }, [user, authLoading, router]);

  const loadFeed = () => {
    setLoading(true);
    try {
      const feedPosts = DataService.getFeed(user!.id);
      
      // Get author details for each post
      const postsWithAuthors = feedPosts.map((post) => {
        const author = AuthService.getUserById(post.authorId);
        return { ...post, author };
      });

      setPosts(postsWithAuthors);
    } catch (error) {
      console.error("Error loading feed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading feed...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-white">
              Meal<span className="text-green-400">Doctor</span>
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/feed" title="Feed">
              <Home className="w-6 h-6 text-green-400" />
            </Link>
            <Link href="/explore" title="Explore">
              <Compass className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/live" title="Live Sessions">
              <Video className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/messages" title="Messages">
              <MessageCircle className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/ai-chat" title="AI Assistant">
              <Bot className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href="/notifications" title="Notifications">
              <Bell className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
            <Link href={user.role === "professional" ? "/dashboard/admin" : "/dashboard/user"} title="Profile">
              <User className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Your Feed</h2>
          <p className="text-gray-400">
            See posts from professionals you follow
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center"
          >
            <Compass className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No posts yet!
            </h3>
            <p className="text-gray-400 mb-6">
              Follow professionals to see their posts in your feed
            </p>
            <Link
              href="/explore"
              className="inline-block bg-green-500 text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              Explore Professionals
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} post={post} author={post.author} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
