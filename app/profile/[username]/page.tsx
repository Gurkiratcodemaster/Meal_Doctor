"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { AuthService, User } from "@/app/lib/services/auth";
import { DataService } from "@/app/lib/services/data";
import Post from "@/app/components/Post";
import { motion } from "framer-motion";
import {
  MessageCircle,
  UserPlus,
  UserMinus,
  Calendar,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------- */
/* MAIN PAGE */
/* -------------------------------------------------- */

export default function ProfilePage() {
  const params = useParams();
  const username = params?.username as string | undefined;

  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (username) {
      loadProfile(username);
    }
  }, [username, isAuthenticated]);

  const loadProfile = (username: string) => {
    setLoading(true);

    const user = AuthService.getUserByUsername(username) as User | null;

    if (!user) {
      router.push("/explore");
      return;
    }

    setProfileUser(user);

    const userPosts = DataService.getPostsByAuthor(user.id).map((post) => ({
      ...post,
      author: user,
    }));

    setPosts(userPosts);

    if (currentUser) {
      setIsFollowing(DataService.isFollowing(currentUser.id, user.id));
    }

    setLoading(false);
  };

  const handleFollow = () => {
    if (!currentUser || !profileUser) return;

    if (isFollowing) {
      DataService.unfollow(currentUser.id, profileUser.id);
      setProfileUser((prev) =>
        prev ? { ...prev, followers: prev.followers - 1 } : prev
      );
    } else {
      DataService.follow(currentUser.id, profileUser.id);
      setProfileUser((prev) =>
        prev ? { ...prev, followers: prev.followers + 1 } : prev
      );
    }

    setIsFollowing((prev) => !prev);
  };

  if (loading || !profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="h-10 w-10 border-2 border-black dark:border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;
  const isProfessional: boolean = profileUser.role === "professional";

  return (
    <main
      className="
        min-h-screen
        bg-gray-50 dark:bg-black
        px-4 py-8
        md:pl-20 lg:pl-56
      "
    >
      <div className="max-w-3xl mx-auto">
        {/* PROFILE HEADER */}
        <ProfileHeader
          user={profileUser}
          postsCount={posts.length}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={handleFollow}
        />

        {/* TABS */}
        <div className="flex gap-8 border-b border-black/15 dark:border-green-500/20 mb-6">
          <TabButton
            label="Posts"
            active={activeTab === "posts"}
            onClick={() => setActiveTab("posts")}
          />
          <TabButton
            label="About"
            active={activeTab === "about"}
            onClick={() => setActiveTab("about")}
          />
        </div>

        {/* TAB CONTENT */}
        {activeTab === "posts" ? (
          posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Post key={post.id} post={post} author={post.author} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">
              No posts yet
            </p>
          )
        ) : isProfessional ? (
          <ProfessionalAbout user={profileUser} />
        ) : (
          <UserAbout user={profileUser} />
        )}
      </div>
    </main>
  );
}

/* -------------------------------------------------- */
/* SUBCOMPONENTS */
/* -------------------------------------------------- */

interface ProfileHeaderProps {
  user: User;
  postsCount: number;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollow: () => void;
}

function ProfileHeader({
  user,
  postsCount,
  isOwnProfile,
  isFollowing,
  onFollow,
}: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        bg-white dark:bg-zinc-950
        border border-black/15 dark:border-green-500/20
        rounded-2xl p-6 mb-8
      "
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="relative">
          <img
            src={
              user.photo ??
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
            }
            alt={user.username}
            className="w-28 h-28 rounded-full object-cover"
          />
          {user.role === "professional" && (
            <span className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1">
              <CheckCircle2 className="w-4 h-4 text-black" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-black dark:text-green-400">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500 dark:text-green-400/60">
            @{user.username}
          </p>

          {user.specialization && (
            <p className="text-green-600 dark:text-green-400 mt-1 font-medium">
              {user.specialization}
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-6 mt-4 text-sm">
            <Stat label="Followers" value={user.followers} />
            <Stat label="Following" value={user.following} />
            <Stat label="Posts" value={postsCount} />
          </div>

          {/* Actions */}
          {!isOwnProfile ? (
            <div className="flex gap-2 mt-4">
              <Link
                href={`/messages?user=${user.id}`}
                className="px-4 py-2 rounded-full bg-black/10 dark:bg-black/30"
              >
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Message
              </Link>

              <button
                onClick={onFollow}
                className={`px-4 py-2 rounded-full transition ${
                  isFollowing
                    ? "bg-black/10 dark:bg-black/30"
                    : "bg-green-500 text-black font-semibold"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4 inline" /> Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 inline" /> Follow
                  </>
                )}
              </button>
            </div>
          ) : (
            <Link
              href="/dashboard/user/edit"
              className="inline-block mt-4 px-4 py-2 rounded-full bg-black/10 dark:bg-black/30"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProfessionalAbout({ user }: { user: User }) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-black/15 dark:border-green-500/20 rounded-xl p-6 space-y-4">
      <p className="text-gray-700 dark:text-green-300">
        {user.bio ?? "No bio available."}
      </p>

      {user.consultationPrice !== undefined && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <IndianRupee className="w-4 h-4" />
          ₹{user.consultationPrice} per session
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-green-400/60">
        <Calendar className="w-4 h-4" />
        Joined {new Date(user.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

function UserAbout({ user }: { user: User }) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-black/15 dark:border-green-500/20 rounded-xl p-6 space-y-4">
      <p className="text-gray-700 dark:text-green-300">
        {user.bio ?? "This user hasn’t added a bio yet."}
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-green-400/60">
        <Calendar className="w-4 h-4" />
        Joined {new Date(user.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 ${
        active
          ? "border-b-2 border-black dark:border-green-500 font-semibold"
          : "text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span>
      <b className="text-black dark:text-green-400">{value}</b> {label}
    </span>
  );
}
