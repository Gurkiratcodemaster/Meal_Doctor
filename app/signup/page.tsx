"use client";

import { useState } from "react";
import Button from "../components/Button";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

export default function SignupPage() {
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"user" | "professional">("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await signup({
        email,
        password,
        firstName,
        lastName,
        username,
        role,
      });
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Page Container: Light gray background, flex centering
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      
      {/* Card Container: White background, shadow, responsive width */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Join us to get started today
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="johndoe123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Role Selection */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">I am a:</span>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value as "user")}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 accent-green-600"
                />
                <span className="text-gray-700 group-hover:text-green-600 transition">User</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  value="professional"
                  checked={role === "professional"}
                  onChange={(e) => setRole(e.target.value as "professional")}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 accent-green-600"
                />
                <span className="text-gray-700 group-hover:text-green-600 transition">Professional</span>
              </label>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 font-semibold hover:underline hover:text-green-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}