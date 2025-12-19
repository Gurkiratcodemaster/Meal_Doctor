"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/home.png" alt="Home" className="h-15 w-15" />
            <span className="font-bold text-lg dark:text-white">
              MealDoctor
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/about" active={pathname === "/about"}>
              About
            </NavLink>

            <NavLink href="/features" active={pathname === "/features"}>
              Features
            </NavLink>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {dark ? "🌙" : "☀️"}
            </button>

            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden dark:text-white"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 py-4">
            <NavLink href="/about" mobile>About</NavLink>
            <NavLink href="/features" mobile>Features</NavLink>

            <button
              onClick={() => setDark(!dark)}
              className="text-left"
            >
              Toggle Dark Mode
            </button>

            <Link href="/login">
              <Button className="w-full bg-green-600 text-white py-2 rounded-lg">
                Login
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
}

/* Reusable NavLink */
function NavLink({ href, children, active, mobile }) {
  return (
    <Link
      href={href}
      className={`font-medium transition relative
        ${mobile ? "" : "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-green-600 after:transition-all"}
        ${active ? "text-green-600 after:w-full" : "text-gray-700 dark:text-gray-300 after:w-0 hover:after:w-full"}
      `}
    >
      {children}
    </Link>
  );
}
