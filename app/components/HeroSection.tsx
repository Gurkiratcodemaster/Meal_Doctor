"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="
        relative
        min-h-[60vh]
        lg:min-h-[70vh]
        flex items-center
        px-4 sm:px-8 lg:px-16
        overflow-hidden
      "
    >
      {/* BACKGROUND IMAGE */}
      <Image
        src="/photo1.jpg"
        alt="Hero Background"
        fill
        priority
        quality={90}
        className="object-cover object-center -z-10"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-10">

        {/* IMAGE SIDE (DESKTOP ONLY) */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="
            hidden lg:block
            w-full max-w-sm lg:max-w-md mx-auto
            aspect-square relative
          "
        >
          {/* Radial Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[90%] h-[90%] rounded-full bg-green-400/35 blur-[110px]" />
          </div>

          <Image
            src="/photo2.png"
            alt="Hero Illustration"
            fill
            priority
            className="object-contain drop-shadow-2xl select-none"
          />
        </motion.div>

        {/* TEXT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="
            text-center
            lg:text-left
            text-white
            max-w-3xl
            mx-auto
            lg:mx-0
          "
        >
          <h1 className="font-extrabold leading-tight text-[clamp(2.2rem,4vw,3.5rem)] drop-shadow-[0_0_18px_rgba(34,197,94,0.35)]">
            Start Your
            <span className="block text-green-400 drop-shadow-[0_0_22px_rgba(34,197,94,0.55)]">
              Meal Doctor App
            </span>
            <span className="block">
              with a Smart Quiz
            </span>
          </h1>

          <p className="mt-5 text-gray-200 text-[clamp(1.1rem,2vw,1.4rem)]">
            Take the quiz and get AI-powered personalized meal suggestions.
          </p>

          <Link href="/quiz">
            <Button
              className="
                mt-8
                bg-green-600
                hover:bg-green-700
                px-8 py-3
                rounded-xl
                text-white
                shadow-[0_0_30px_rgba(34,197,94,0.55)]
                hover:shadow-[0_0_45px_rgba(34,197,94,0.8)]
                hover:scale-105
                transition
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
