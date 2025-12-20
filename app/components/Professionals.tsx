"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.25),_transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-4">

        {/* GLASS CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="
            backdrop-blur-xl bg-white/5
            border border-white/10
            rounded-3xl shadow-2xl
            p-10
          "
        >
          {/* HEADING */}
          <h2 className="text-3xl font-extrabold text-center text-white mb-2">
            Popular Professionals
          </h2>
          <p className="text-center text-gray-400 mb-10">
            AI-curated experts trusted by thousands
          </p>

          {/* SCROLL BUTTONS (DESKTOP) */}
          <button
            onClick={() => scroll("left")}
            className="
              hidden md:flex
              absolute left-4 top-1/2 -translate-y-1/2
              w-11 h-11 rounded-full
              bg-white/10 backdrop-blur
              text-white text-xl
              hover:bg-green-400 hover:text-black
              transition
            "
          >
            ◀
          </button>

          <button
            onClick={() => scroll("right")}
            className="
              hidden md:flex
              absolute right-4 top-1/2 -translate-y-1/2
              w-11 h-11 rounded-full
              bg-white/10 backdrop-blur
              text-white text-xl
              hover:bg-green-400 hover:text-black
              transition
            "
          >
            ▶
          </button>

          {/* CARD ROW */}
          <div
            ref={scrollRef}
            className="
              flex gap-6 overflow-x-auto scroll-smooth
              pb-4 px-2
              scrollbar-hide
            "
          >
            {professionals.map((pro, index) => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="
                  min-w-[230px] flex-shrink-0
                  group flex flex-col items-center text-center
                  bg-white/10 backdrop-blur-lg
                  border border-white/10
                  rounded-2xl p-6
                  hover:-translate-y-3
                  hover:shadow-[0_0_40px_rgba(34,197,94,0.6)]
                  transition
                "
              >
                {/* AVATAR */}
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 rounded-full bg-green-400/40 blur-xl" />
                  <Image
                    src={pro.image}
                    alt={pro.name}
                    fill
                    className="relative rounded-full object-cover"
                  />
                </div>

                {/* NAME */}
                <h3 className="text-lg font-bold text-white">
                  {pro.name}
                </h3>

                {/* SKILL */}
                <p className="text-sm text-gray-300 mb-5">
                  {pro.skill}
                </p>

                {/* FOLLOW BUTTON */}
                <button
                  onClick={() => handleFollow(pro.id)}
                  className="
                    mt-auto
                    px-6 py-2 rounded-full
                    bg-green-500 text-black font-semibold
                    shadow-[0_0_20px_rgba(34,197,94,0.6)]
                    hover:shadow-[0_0_35px_rgba(34,197,94,0.9)]
                    hover:scale-105
                    transition
                  "
                >
                  Follow
                </button>
              </motion.div>
            ))}
          </div>

          {/* MOBILE HINT */}
          <p className="mt-6 text-center text-sm text-gray-400 md:hidden">
            Swipe to explore experts →
          </p>
        </motion.div>
      </div>
    </section>
  );
}
