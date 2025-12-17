"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Professional {
  id: string;
  name: string;
  skill: string;
}

export default function Professionals() {
  const router = useRouter();

  // Dummy data for now — replace with database/users fetched from API
  const professionals: Professional[] = [
    { id: "1", name: "Dr. Aman Singh", skill: "Diet Specialist" },
    { id: "2", name: "Riya Mehta", skill: "Fitness Coach" },
    { id: "3", name: "Gurpreet Kaur", skill: "Nutrition Advisor" },
  ];

  // Fake user-auth state (replace with your auth system)
  const [isLoggedIn] = useState(false);

  const handleFollow = (id: string) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Otherwise follow the user
    console.log("Followed professional with ID:", id);
  };

  return (
    <section className="bg-white px-8 py-16">
      <h2 className="text-3xl font-bold text-black mb-6">Registered Professionals</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {professionals.map((pro) => (
          <div
            key={pro.id}
            className="border border-green-300 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-black">{pro.name}</h3>
            <p className="text-gray-600 mb-3">{pro.skill}</p>

            <button
              onClick={() => handleFollow(pro.id)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
