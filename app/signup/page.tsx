"use client";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, query, collection, where } from "firebase/firestore";
import { useState } from "react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [role, setRole] = useState("");
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const q = query(collection(db, "users"), where("username", "==", username));
      const check = await getDocs(q);

      if (!check.empty) {
        alert("Username already taken");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (!fullName || !username || !email || !password || !role) {
        alert("All fields are required");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        username,
        email,
        role,
      });
      alert("Signup successful!");

      if (role == "user") {
        router.push("/dashboard/user");
      } else {
        router.push("/dashboard/admin");
      }
    } catch (error: any) {
      alert(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h1>

        <form className="flex flex-col space-y-4"
          onSubmit={handleSignup}
        >

          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />


          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button type="submit">{loading ? "Signing Up..." : "Sign Up"}</Button>

        </form>
      </div>
    </div>
  );
}
