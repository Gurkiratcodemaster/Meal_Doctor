"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { DataService } from "@/app/lib/services/data";
import { AuthService } from "@/app/lib/services/auth";
import { motion } from "framer-motion";
import Link from "next/link";

interface PostProps {
  post: {
    id: string;
    authorId: string;
    content: string;
    image?: string | null;
    likes: number;
    comments: number;
    createdAt: string;
  };
  author: {
    firstName: string;
    lastName: string;
    username: string;
    photo?: string;
    specialization?: string;
  };
}

export default function Post({ post, author }: PostProps) {
  const currentUser = AuthService.getCurrentUser();
  const [liked, setLiked] = useState(
    currentUser ? DataService.hasLiked(post.id, currentUser.id) : false
  );
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!currentUser) return;

    if (liked) {
      DataService.unlikePost(post.id, currentUser.id);
      setLikeCount((prev) => prev - 1);
    } else {
      DataService.likePost(post.id, currentUser.id);
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/30 transition-all"
    >
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/profile/${author.username}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:scale-105 transition">
            {author.firstName[0]}{author.lastName[0]}
          </div>
        </Link>
        <div className="flex-1">
          <Link href={`/profile/${author.username}`}>
            <h3 className="text-white font-semibold hover:text-green-400 transition">
              {author.firstName} {author.lastName}
            </h3>
          </Link>
          {author.specialization && (
            <p className="text-gray-400 text-sm">{author.specialization}</p>
          )}
          <p className="text-gray-500 text-xs">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-200 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Image */}
      {post.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt="Post image"
            className="w-full h-auto object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-white/10">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-all ${
            liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all ml-auto">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-gray-400 text-sm">Comments coming soon...</p>
        </div>
      )}
    </motion.div>
  );
}
