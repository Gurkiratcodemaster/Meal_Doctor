"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const [profile, setProfile] = useState({
    name: "",
    goal: "",
    diet: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return router.push("/login");

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    const user = auth.currentUser;

    await setDoc(
      doc(db, "users", user.uid),
      { ...profile, updatedAt: new Date() },
      { merge: true }
    );

    alert("Profile updated");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/20 via-black to-black p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <div className="max-w-lg bg-white/10 backdrop-blur-lg p-6 rounded-xl space-y-4">

        <input
          className="input"
          placeholder="Your Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />

        <select
          className="input bg-black/40"
          value={profile.goal}
          onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
        >
          <option value="">Select Goal</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="healthy_life">Healthy Lifestyle</option>
        </select>

        <select
          className="input bg-black/40"
          value={profile.diet}
          onChange={(e) => setProfile({ ...profile, diet: e.target.value })}
        >
          <option value="">Diet Preference</option>
          <option value="veg">Vegetarian</option>
          <option value="nonveg">Non-Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>

        <Button onClick={updateProfile} className="w-full bg-green-500 text-black">
          Update Profile
        </Button>
      </div>
    </div>
  );
}
