"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { AuthService, User } from "@/app/lib/services/auth";
import { DataService } from "@/app/lib/services/data";
import Post from "@/app/components/Post";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  UserPlus,
  UserMinus,
  MapPin,
  Calendar,
  TrendingUp,
  IndianRupee,
  Video,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const username = params.username as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadProfile();
  }, [username, isAuthenticated, router]);

  const loadProfile = () => {
    setLoading(true);

    // Find user by username
    const user = AuthService.getUserByUsername(username);
    if (!user) {
      router.push("/explore");
      return;
    }

    setProfileUser(user as User);

    // Get user's posts
    const userPosts = DataService.getPostsByAuthor(user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const postsWithAuthor = userPosts.map((post) => ({
      ...post,
      author: user,
    }));

    setPosts(postsWithAuthor);

    // Check if current user follows this profile
    if (currentUser) {
      const isFollowingUser = DataService.isFollowing(currentUser.id, user.id);
      setIsFollowing(isFollowingUser);
    }

    setLoading(false);
  };

  const handleFollow = () => {
    if (!currentUser || !profileUser) return;

    if (isFollowing) {
      DataService.unfollow(currentUser.id, profileUser.id);
      setIsFollowing(false);
      // Update follower count
      setProfileUser({ ...profileUser, followers: profileUser.followers - 1 });
    } else {
      DataService.follow(currentUser.id, profileUser.id);
      setIsFollowing(true);
      // Update follower count
      setProfileUser({ ...profileUser, followers: profileUser.followers + 1 });
    }
  };

  const handleMessage = () => {
    if (!profileUser) return;
    router.push(`/messages?user=${profileUser.id}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profileUser) {
    return null;
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">
              {profileUser.firstName} {profileUser.lastName}
            </h1>
            <p className="text-sm text-gray-400">{posts.length} posts</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Cover Photo Placeholder */}
          <div className="h-48 bg-gradient-to-r from-green-600 to-green-800 rounded-xl mb-6 relative">
            {profileUser.isLive && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 animate-pulse">
                <Video className="w-4 h-4" />
                LIVE
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="-mt-16 relative">
              <img
                src={profileUser.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.username}`}
                alt={profileUser.firstName}
                className="w-32 h-32 rounded-full border-4 border-black object-cover bg-gray-800"
              />
              {profileUser.role === "professional" && (
                <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {profileUser.firstName} {profileUser.lastName}
                  </h2>
                  <p className="text-gray-400">@{profileUser.username}</p>
                  {profileUser.role === "professional" && profileUser.specialization && (
                    <p className="text-green-400 font-medium mt-1">
                      {profileUser.specialization}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleMessage}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button
                      onClick={handleFollow}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                        isFollowing
                          ? "bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400"
                          : "bg-green-500 hover:bg-green-600 text-black font-semibold"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                )}

                {isOwnProfile && (
                  <Link
                    href={profileUser.role === "professional" ? "/dashboard/admin/edit" : "/dashboard/user/edit"}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>

              {/* Bio */}
              {profileUser.bio && (
                <p className="text-gray-300 mb-4">{profileUser.bio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-4">
                <div>
                  <span className="font-bold text-white">{profileUser.followers}</span>
                  <span className="text-gray-400 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-white">{profileUser.following}</span>
                  <span className="text-gray-400 ml-1">Following</span>
                </div>
                <div>
                  <span className="font-bold text-white">{posts.length}</span>
                  <span className="text-gray-400 ml-1">Posts</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(profileUser.createdAt)}
                </div>
                {profileUser.role === "professional" && profileUser.consultationPrice && (
                  <div className="flex items-center gap-1 text-green-400">
                    <IndianRupee className="w-4 h-4" />
                    ₹{profileUser.consultationPrice} consultation
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-white/10 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`pb-4 px-1 border-b-2 transition ${
                activeTab === "posts"
                  ? "border-green-500 text-white font-semibold"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-4 px-1 border-b-2 transition ${
                activeTab === "about"
                  ? "border-green-500 text-white font-semibold"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              About
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "posts" ? (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No posts yet</p>
              </div>
            ) : (
              posts.map((post) => (
                <Post key={post.id} post={post} author={post.author} />
              ))
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">About</h3>
            <div className="space-y-4 text-gray-300">
              {profileUser.bio ? (
                <p>{profileUser.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio available</p>
              )}

              {profileUser.role === "professional" && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-semibold text-white mb-2">Professional Details</h4>
                  {profileUser.specialization && (
                    <p className="mb-2">
                      <span className="text-gray-400">Specialization:</span>{" "}
                      {profileUser.specialization}
                    </p>
                  )}
                  {profileUser.consultationPrice && (
                    <p>
                      <span className="text-gray-400">Consultation Fee:</span>{" "}
                      <span className="text-green-400 font-semibold">
                        ₹{profileUser.consultationPrice}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
