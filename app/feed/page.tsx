"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">Feed</h1>

        <p className="mb-4 text-gray-600">
          Logged in as <b>{user.username}</b>
        </p>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
