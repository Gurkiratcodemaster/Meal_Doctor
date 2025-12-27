"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900/30 via-black to-black">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-8 rounded-2xl w-full max-w-sm text-white"
      >

        <h1 className="text-3xl font-extrabold mb-6 text-center">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 rounded-md bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 rounded-md bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-black font-bold hover:scale-105 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-gray-300">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-green-400 hover:underline">
              Sign up
            </Link>
          </p>
          <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
            <p className="text-xs text-gray-300 text-center mb-2">Demo Accounts:</p>
            <p className="text-xs text-gray-400">👤 User: rajesh.kumar@example.com</p>
            <p className="text-xs text-gray-400">👨‍⚕️ Professional: dr.aman.singh@mealdoctor.com</p>
            <p className="text-xs text-gray-400 mt-1">Password: password123</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
