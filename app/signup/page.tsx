"use client";

import { useState } from "react";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, query, collection, where } from "firebase/firestore";
import Link from "next/link";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const username = `${firstName}${lastName}`.toLowerCase() + user.uid.slice(0, 5);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        username,
        email,
        role,
        createdAt: new Date(),
      });
      if (role === "user") {
        router.push("/dashboard/user");
      } else {
        router.push("/dashboard/admin");
      }


    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignup = async () => {
    setError("");
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const displayName = user.displayName || "";
      const first = displayName.split(" ")[0] || "";
      const last = displayName.split(" ").slice(1).join(" ") || "";

      const username =
        displayName.replace(/\s+/g, "").toLowerCase() + user.uid.slice(0, 5);

      // save user profile (non-blocking)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: first,
        lastName: last,
        username,
        email: user.email,
        role: "user", // default role
        createdAt: new Date(),
      });

      router.push("/dashboard/user");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-[80%] max-w-[350px] mx-auto flex flex-col items-center justify-center border-2 border-black 
  rounded-2xl 
  p-10 mt-16">

      <h1 className="flex items-center text-3xl font-bold mb-2 text-black">
        <img src="/home.png" className="w-15" />
        <span className="font-bold text-xl">
          Meal<span className="text-green-500">Doctor</span>
        </span>
      </h1>

      <p className="text-sm mb-6">
        Create your healthy journey account 🌱
      </p>

      <form onSubmit={handleSignup} className="flex flex-col space-y-4 w-full">

        <input
          className="input border border-black/60 
      rounded-lg text-black placeholder-gray-400 px-2 py-1
      focus:outline-none"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="input border border-black/60 
      rounded-lg text-black placeholder-gray-400 px-2 py-1 focus:outline-none"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          className="input border border-black/60 
      rounded-lg text-black placeholder-gray-400 px-2 py-1 focus:outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="input border border-black/60 
      rounded-lg text-black placeholder-gray-400 px-2 py-1 focus:outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" disabled>Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>

        </select>

        <input
          className="input border border-black/60 
      rounded-lg text-black placeholder-gray-400 px-2 py-1 focus:outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="input border border-black/60 
      rounded-lg text-black placeholder-gray-400 px-2 py-1   focus:outline-none"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <Button
          className="bg-green-500  
      py-3 rounded-xl 
      hover:bg-green-400 hover:scale-[1.03]"
          type="submit"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
        <Button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 border border-black/40 hover:bg-gray-100 mb-4"
        >
          <img src="/google.png" className="w-5 h-5" />
          Sign up with Google
        </Button>


        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>

      </form>
    </div>

  );
}
