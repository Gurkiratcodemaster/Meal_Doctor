"use client";

import { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Heart, MessageCircle, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  // Mock notifications for UI demonstration
  const notifications = [
    {
      id: "1",
      type: "follow",
      user: "Dr. Aman Singh",
      message: "started following you",
      time: "2h ago",
      read: false,
    },
    {
      id: "2",
      type: "like",
      user: "Priya Sharma",
      message: "liked your post",
      time: "5h ago",
      read: false,
    },
    {
      id: "3",
      type: "comment",
      user: "Rahul Verma",
      message: "commented on your post",
      time: "1d ago",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "follow":
        return <UserPlus className="w-5 h-5 text-blue-400" />;
      case "like":
        return <Heart className="w-5 h-5 text-red-400" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition cursor-pointer ${
                  notification.read
                    ? "bg-white/5 border-white/10"
                    : "bg-green-500/10 border-green-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className="text-white">
                      <span className="font-semibold">{notification.user}</span>{" "}
                      <span className="text-gray-300">{notification.message}</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Note: Notifications are currently mock data for UI demonstration
          </p>
        </div>
      </div>
    </div>
  );
}
