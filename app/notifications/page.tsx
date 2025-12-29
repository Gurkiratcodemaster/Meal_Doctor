"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
} from "lucide-react";

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

function getIcon(type: string) {
  switch (type) {
    case "follow":
      return <UserPlus className="w-5 h-5" />;
    case "like":
      return <Heart className="w-5 h-5" />;
    case "comment":
      return <MessageCircle className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
}

export default function NotificationsPage() {
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
          <h1 className="text-3xl font-bold text-black dark:text-green-500">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-green-400/70">
            Recent activity and updates
          </p>
        </motion.div>

        {/* Empty state */}
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 mx-auto text-gray-400 dark:text-green-400/50 mb-4" />
            <p className="text-gray-500 dark:text-green-400/70">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  flex items-start gap-4
                  p-4 rounded-xl
                  border
                  transition
                  cursor-pointer
                  ${
                    n.read
                      ? "bg-white dark:bg-zinc-950 border-black/15 dark:border-green-500/20"
                      : "bg-black/10 dark:bg-green-500/15 border-black/20 dark:border-green-500/30"
                  }
                `}
              >
                {/* Icon */}
                <div
                  className="
                    mt-1
                    text-black dark:text-green-400
                  "
                >
                  {getIcon(n.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-black dark:text-green-300">
                    <span className="font-semibold">{n.user}</span>{" "}
                    <span className="text-gray-700 dark:text-green-300/80">
                      {n.message}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-green-400/60 mt-1">
                    {n.time}
                  </p>
                </div>

                {/* Unread Dot */}
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-black dark:bg-green-500 mt-2" />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-gray-500 dark:text-green-400/50">
          Notifications are currently demo data
        </p>
      </div>
    </main>
  );
}
