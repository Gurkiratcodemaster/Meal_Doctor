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
      <div className="flex flex-col h-screen px-2 w-[10%] md:w-1/5 min-w-[65px] border-r-2 border-black space-y-8">
        
        <Link href="/" className="flex items-center text-black">
          <img src="/home.png" className="w-[40px]" />
          <span className="hidden lg:inline font-bold text-xl">
            Meal<span className="text-green-500">Doctor</span>
          </span>
        </Link>
          <NavLink href="/Explore" active={pathname === "/Explore"}>
            <Compass className="inline"/> <span className="hidden  md:inline ml-1">Explore</span>
          </NavLink><NavLink href="/Messages" active={pathname === "/Messages"}>
           <MessageCircle className="inline"/><span className="hidden md:inline ml-1">Messages</span>
          </NavLink>
          <NavLink href="/Notifications" active={pathname === "/Notifications"}>
             <Bell className="inline"/><span className="hidden md:inline ml-1">Notifications</span>
          </NavLink>
          <NavLink href="/Profile" active={pathname === "/Profile"}>
            <User className="inline"/> <span className="hidden md:inline ml-1">Profile</span>
          </NavLink>

        {/* DESKTOP LOGIN */}
        {/* <div className="hidden md:block">
          <Link href="/login">
            <Button className="bg-green-500 px-6 py-2 rounded-xl hover:scale-105">
              Login
            </Button>
          </Link>
        </div> */}

        {/* MOBILE MENU BUTTON */}
        {/* <Button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </Button> */}
      </div>

      {/* MOBILE MENU */}
      {/* {menuOpen && (
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
      )} */}
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
        transition-all duration-300 px-2
        hover:bg-gray-200 hover:rounded-lg hover:p-1
      `}
    >
      {children}
    </Link>
  );
}
