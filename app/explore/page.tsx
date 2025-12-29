"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";

const explorePosts = [
  {
    id: 1,
    author: "Dr. Sarah Lee",
    role: "Nutritionist",
    category: "Balanced Diet",
    content:
      "A good diet routine starts with consistency. Focus on whole foods, balanced macros, and hydration before worrying about supplements.",
  },
  {
    id: 2,
    author: "Coach Ryan Miller",
    role: "Fitness Coach",
    category: "Daily Routine",
    content:
      "Your diet doesn’t need to be perfect — it needs to be sustainable. Build meals you enjoy and can repeat long-term.",
  },
  {
    id: 3,
    author: "Dr. Emily Watson",
    role: "Dietician",
    category: "Healthy Habits",
    content:
      "Eating at the same time every day helps regulate digestion and energy levels. Routine matters more than trends.",
  },
];

export default function ExplorePage() {
  return (
    <main
      className="
        min-h-screen
        bg-gray-50 dark:bg-black
        px-4 py-8
        md:pl-20 lg:pl-56
        transition-colors
      "
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-black dark:text-green-500 mb-1">
            Explore
          </h1>
          <p className="text-gray-600 dark:text-green-400/70">
            Popular professional posts on diet & healthy routines
          </p>
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          {explorePosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                bg-white dark:bg-zinc-950
                border border-black/15 dark:border-green-500/20
                rounded-2xl
                p-6
              "
            >
              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="
                    w-10 h-10 rounded-full
                    bg-black/80 dark:bg-green-600
                    text-white
                    flex items-center justify-center
                    font-bold
                  "
                >
                  {post.author[0]}
                </div>
                <div>
                  <p className="font-semibold text-black dark:text-green-400">
                    {post.author}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-green-400/60">
                    {post.role} · {post.category}
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-800 dark:text-green-300 leading-relaxed mb-6">
                {post.content}
              </p>

              {/* Actions */}
              <div
                className="
                  flex items-center gap-6
                  text-black dark:text-green-400
                "
              >
                <button
                  className="
                    flex items-center gap-2
                    hover:bg-black/20 dark:hover:bg-black/30
                    px-3 py-1.5
                    rounded-lg
                    transition
                  "
                >
                  <Heart className="w-4 h-4" />
                  Like
                </button>

                <button
                  className="
                    flex items-center gap-2
                    hover:bg-black/20 dark:hover:bg-black/30
                    px-3 py-1.5
                    rounded-lg
                    transition
                  "
                >
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </button>

                <button
                  className="
                    flex items-center gap-2
                    hover:bg-black/20 dark:hover:bg-black/30
                    px-3 py-1.5
                    rounded-lg
                    transition
                  "
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
