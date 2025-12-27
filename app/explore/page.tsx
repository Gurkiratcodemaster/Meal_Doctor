"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { DataService } from "@/app/lib/services/data";
import Post from "@/app/components/Post";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Compass, MessageCircle, Bell, User, UserPlus, TrendingUp, Mail, Video, Bot } from "lucide-react";

export default function ExplorePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [trendingProfessionals, setTrendingProfessionals] = useState<any[]>([]);
  const [suggestedProfessionals, setSuggestedProfessionals] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadExploreData();
    }
  }, [user, authLoading, router]);

  const loadExploreData = () => {
    setLoading(true);
    try {
      // Get trending professionals
      const trending = DataService.getTrendingProfessionals(6);
      setTrendingProfessionals(trending);

      // Get suggested professionals to follow
      const suggested = DataService.getSuggestedProfessionals(user!.id, 5);
      setSuggestedProfessionals(suggested);

      // Get all posts sorted by date
      const posts = DataService.getAllPosts()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 20); // Limit to 20 posts

      // Add author info
      const postsWithAuthors = posts.map((post) => ({
        ...post,
        author: DataService.getAllProfessionals().find((p) => p.id === post.authorId),
      }));

      setAllPosts(postsWithAuthors);
    } catch (error) {
      console.error("Error loading explore data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = (professionalId: string) => {
    if (!user) return;
    
    const isFollowing = DataService.isFollowing(user.id, professionalId);
    
    if (isFollowing) {
      DataService.unfollow(user.id, professionalId);
    } else {
      DataService.follow(user.id, professionalId);
    }
    
    // Reload data
    loadExploreData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black">
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
              <Compass className="w-6 h-6 text-green-400" />
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
            <Link href={user.role === "professional" ? "/dashboard/admin" : "/dashboard/user"}>
              <User className="w-6 h-6 text-gray-400 hover:text-white transition" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Explore</h2>
          <p className="text-gray-400">
            Discover professionals and trending content
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Latest Posts
            </h3>
            {allPosts.map((post) => (
              post.author && <Post key={post.id} post={post} author={post.author} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested to Follow */}
            {suggestedProfessionals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Suggested for You
                </h3>
                <div className="space-y-4">
                  {suggestedProfessionals.map((prof) => (
                    <div key={prof.id} className="flex items-center gap-3">
                      <Link href={`/profile/${prof.username}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition">
                          {prof.firstName[0]}{prof.lastName[0]}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/profile/${prof.username}`}>
                          <h4 className="text-white text-sm font-medium truncate hover:text-green-400 transition">
                            {prof.firstName} {prof.lastName}
                          </h4>
                        </Link>
                        <p className="text-gray-400 text-xs truncate">
                          {prof.specialization}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/messages?user=${prof.id}`)}
                          className="text-gray-400 hover:text-green-400 transition"
                          title="Message"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFollow(prof.id)}
                          className="text-green-400 hover:text-green-300 transition"
                        >
                          <UserPlus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Trending Professionals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Top Professionals
              </h3>
              <div className="space-y-4">
                {trendingProfessionals.map((prof, idx) => (
                  <div key={prof.id} className="flex items-center gap-3">
                    <span className="text-gray-500 font-bold text-sm w-4">
                      {idx + 1}
                    </span>
                    <Link href={`/profile/${prof.username}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition">
                        {prof.firstName[0]}{prof.lastName[0]}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/profile/${prof.username}`}>
                        <h4 className="text-white text-sm font-medium truncate hover:text-green-400 transition">
                          {prof.firstName} {prof.lastName}
                        </h4>
                      </Link>
                      <p className="text-gray-400 text-xs">
                        {prof.followers} followers
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/messages?user=${prof.id}`)}
                      className="text-gray-400 hover:text-green-400 transition"
                      title="Message"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
