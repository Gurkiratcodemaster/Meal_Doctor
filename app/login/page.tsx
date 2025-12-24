"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // redirect after login
    } catch (err) {
      setError(err.message);
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

        </form>
      </motion.div>
    </div>
  );
}
