"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[50vh] flex items-center ">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/photo1.jpg"
        alt="Hero Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-green-800/20 to-black" />

      <div className="relative z-10 px-6 grid lg:grid-cols-2 gap-16">
        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block relative aspect-square"
        >
          <Image
            src="/photo2.png"
            alt="AI Health"
            fill
            className="drop-shadow-[0_0_50px_rgba(34,197,94,1)]"
          />
        </motion.div>

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <h1 className="text-[clamp(2.5rem,4vw,3.8rem)] font-extrabold leading-tight">
            Your
            <span className="block text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,1)]">
              AI Meal Doctor
            </span>
            Starts Here
          </h1>

          <p className="mt-6 text-gray-300 text-lg max-w-sm">
            Take a smart quiz and receive AI-powered meal and health insights
            tailored just for you.
          </p>

          <Link href="/quiz">
            <Button
              className="
                mt-8 px-10 py-3 rounded-xl
                bg-green-500 font-bold
                border-2
                hover:scale-105 transition
              "
            >
              Start Quiz
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
