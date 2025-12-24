"use client";

import { useState } from "react";
import {
  Search,
  Compass,
  MessageCircle,
  User,
  Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Button from "./Button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <div className="block h-screen px-4 w-1/5 bg-gray-200">

        {/* LOGO */}
        <Link href="/" className="flex items-center text-black pb-2 mb-2">
          <img src="/home.png" className="w-15" />
          <span className="font-bold text-xl">
            Meal<span className="text-green-500">Doctor</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex flex-col gap-4">
          <NavLink href="/Search" active={pathname === "/Search"}>
            <Compass className="inline mr-2"/> Explore
          </NavLink><NavLink href="/Search" active={pathname === "/Search"}>
           <MessageCircle className="inline mr-2"/> Messages
          </NavLink>
          <NavLink href="/Search" active={pathname === "/Search"}>
             <Bell className="inline mr-2"/>Notifications
          </NavLink>
          <NavLink href="/Search" active={pathname === "/Search"}>
            <User className="inline mr-2"/> Profile
          </NavLink>


        </div>

        {/* DESKTOP LOGIN */}
        {/* <div className="hidden md:block">
          <Link href="/login">
            <Button className="bg-green-500 px-6 py-2 rounded-xl hover:scale-105">
              Login
            </Button>
          </Link>
        </div> */}

        {/* MOBILE MENU BUTTON */}
        <Button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </Button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-4">
          <NavLink mobile={true} href="/about" active={pathname === "/about"}>
            About
          </NavLink>
          <NavLink mobile={true} href="/features" active={pathname === "/features"}>
            Features
          </NavLink>

          <Link href="/login">
            <Button className="w-full mt-4 bg-green-500 py-2 rounded-xl">
              Login
            </Button>
          </Link>
        </div>
      )}
      </div>
      );
}
function NavLink({
  href,
  children,
  active = false,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        ${mobile ? "block py-3" : ""}
        text-black font-medium
        border-b-2
        pb-3
        transition-all duration-300
        ${active
          ? "border-green-500"
          : "border-transparent hover:border-green-500"
        }
      `}
    >
      {children}
    </Link>
  );
}
