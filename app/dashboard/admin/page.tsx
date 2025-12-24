"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

export default function ProfessionalDashboard() {
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    experience: "",
    fee: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return router.push("/login");

      const ref = doc(db, "professionals", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      await setDoc(doc(db, "professionals", user.uid), {
        ...profile,
        uid: user.uid,
        updatedAt: new Date(),
      });

      alert("Profile updated successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/20 via-black to-black p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Professional Dashboard</h1>

      <div className="max-w-xl bg-white/10 backdrop-blur-lg p-6 rounded-xl space-y-4">

        <input
          className="input"
          placeholder="Full Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />

        <input
          className="input"
          placeholder="Specialization (Dietitian, Doctor)"
          value={profile.specialization}
          onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
        />

        <input
          className="input"
          placeholder="Experience (e.g. 5 years)"
          value={profile.experience}
          onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
        />

        <input
          className="input"
          placeholder="Consultation Fee"
          value={profile.fee}
          onChange={(e) => setProfile({ ...profile, fee: e.target.value })}
        />

        <textarea
          className="input h-24"
          placeholder="Short Bio"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />

        <Button onClick={saveProfile} className="w-full bg-green-500 text-black">
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
