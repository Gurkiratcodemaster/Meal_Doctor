"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    goal: "",
    diet: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
            goal: data.goal || "",
            diet: data.diet || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const updateProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        goal: profile.goal,
        diet: profile.diet,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    alert("Profile updated");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/20 via-black to-black p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <div className="max-w-lg bg-white/10 backdrop-blur-lg p-6 rounded-xl space-y-4">

        <input
          className="input"
          placeholder="Your Name"
          value={profile.name}
          disabled
        />

        <select
          className="input bg-black/40"
          value={profile.goal}
          onChange={(e) =>
            setProfile({ ...profile, goal: e.target.value })
          }
        >
          <option value="">Select Goal</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="healthy_life">Healthy Lifestyle</option>
        </select>

        <select
          className="input bg-black/40"
          value={profile.diet}
          onChange={(e) =>
            setProfile({ ...profile, diet: e.target.value })
          }
        >
          <option value="">Diet Preference</option>
          <option value="veg">Vegetarian</option>
          <option value="nonveg">Non-Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>

        <Button className="w-full bg-green-500 text-black" onClick={updateProfile}>
          Update Profile
        </Button>
      </div>
    </div>
  );
}
