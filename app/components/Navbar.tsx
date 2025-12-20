"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Button from "./Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`
        sticky top-0 z-50
        ${scrolled
          ? "bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
          : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/home.png" className="w-9 h-9" />
          <span className="font-bold text-white text-lg tracking-wide">
            Meal<span className="text-green-400">Doctor</span>
          </span>
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex gap-8 font-color-black">
          <NavLink href="/about" active={pathname === "/about"}>About</NavLink>
          <NavLink href="/features" active={pathname === "/features"}>Features</NavLink>
        </div>

        {/* ACTION */}
        <div className="hidden md:flex">
          <Link href="/login">
            <Button
              className="
                bg-green-500 text-black font-semibold
                px-6 py-2 rounded-xl
                shadow-[0_0_20px_rgba(34,197,94,0.6)]
                hover:shadow-[0_0_35px_rgba(34,197,94,0.9)]
                transition
              "
            >
              Login
            </Button>
          </Link>
        </div>

        {/* MOBILE */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white text-2xl">
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-4 pt-2 bg-black/70 backdrop-blur-xl">
          <NavLink mobile href="/about">About</NavLink>
          <NavLink mobile href="/features">Features</NavLink>
          <Link href="/login">
            <Button className="mt-4 w-full bg-green-500 text-black py-2 rounded-xl">
              Login
            </Button>
          </Link>
        </div>
      )}
    </motion.nav>
  );
}

function NavLink({ href, children, active, mobile }: any) {
  return (
    <Link
      href={href}
      className={`
        ${mobile ? "block py-3" : ""}
        text-white font-medium relative
        after:absolute after:left-0 after:-bottom-1 after:h-[2px]
        after:bg-green-400 after:transition-all
        ${active ? "after:w-full" : "after:w-0 hover:after:w-full"}
      `}
    >
      {children}
    </Link>
  );
}
