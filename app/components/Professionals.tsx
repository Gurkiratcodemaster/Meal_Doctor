"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";

interface Professional {
  id: string;
  name: string;
  skill: string;
  image: string;
}

export default function Professionals() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const professionals: Professional[] = [
    { id: "1", name: "Dr. Aman Singh", skill: "Diet Specialist", image: "/doctor1.png" },
    { id: "2", name: "Riya Mehta", skill: "Fitness Coach", image: "/doctor2.png" },
    { id: "3", name: "Gurpreet Kaur", skill: "Nutrition Advisor", image: "/doctor3.png" },
    { id: "4", name: "Neha Sharma", skill: "Weight Loss Expert", image: "/doctor4.png" },
    { id: "5", name: "Arjun Verma", skill: "Sports Nutritionist", image: "/doctor5.png" },
    { id: "6", name: "Simran Kaur", skill: "Wellness Coach", image: "/doctor6.png" },
  ];

  const [isLoggedIn] = useState(false);

  const handleFollow = (id: string) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    console.log("Followed professional with ID:", id);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg border border-green-200 rounded-3xl shadow-xl p-10 relative">

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Popular Professionals
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Follow experts trusted by thousands
        </p>

        {/* Scroll Buttons (Desktop) */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:bg-green-50 transition"
        >
          ◀
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:bg-green-50 transition"
        >
          ▶
        </button>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="
            flex gap-6 overflow-x-auto scroll-smooth
            pb-4 px-2
            scrollbar-hide
          "
        >
          {professionals.map((pro) => (
            <div
              key={pro.id}
              className="
                min-w-[220px]
                flex-shrink-0
                group
                flex flex-col items-center
                text-center
                bg-white
                border border-green-200
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-lg
                hover:-translate-y-2
                transition
              "
            >
              {/* Avatar */}
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 rounded-full bg-green-400/30 blur-xl" />
                <Image
                  src={pro.image}
                  alt={pro.name}
                  fill
                  className="relative rounded-full object-cover"
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                {pro.name}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {pro.skill}
              </p>

              <button
                onClick={() => handleFollow(pro.id)}
                className="
                  mt-auto
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  font-semibold
                  px-6 py-2
                  rounded-full
                  shadow-[0_0_20px_rgba(34,197,94,0.4)]
                  hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]
                  transition
                "
              >
                Follow
              </button>
            </div>
          ))}
        </div>

        {/* Mobile Hint */}
        <p className="mt-4 text-center text-sm text-gray-500 md:hidden">
          Swipe to see more →
        </p>

      </div>
    </section>
  );
}
