"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { DataService } from "@/app/lib/services/data";
import { AuthService } from "@/app/lib/services/auth";
import Post from "@/app/components/Post";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass } from "lucide-react";

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

    if (user) loadFeed();
  }, [user, authLoading, router]);

  const loadFeed = () => {
    setLoading(true);
    try {
      const feedPosts = DataService.getFeed(user!.id);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Loading feed...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main
      className="
        min-h-screen
        bg-gray-50
        px-4 py-8
        md:pl-20 lg:pl-56
        transition-all duration-300
      "
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-black mb-1">
            Your Feed
          </h1>
          <p className="text-gray-500">
            Posts from professionals you follow
          </p>
        </motion.div>

        {/* Empty State */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              bg-white
              border border-gray-200
              rounded-2xl
              p-12
              text-center
            "
          >
            <Compass className="w-14 h-14 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 mb-6">
              Follow professionals to see content here
            </p>
            <Link
              href="/explore"
              className="
                inline-flex items-center
                bg-black text-white
                px-6 py-3
                rounded-xl
                hover:bg-black/90
                transition
              "
            >
              Explore Professionals
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                author={post.author}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
