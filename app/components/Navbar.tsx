"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

import {
  Search,
  Compass,
  MessageCircle,
  User,
  Bell,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  const handleSignOut = async () => {

    await signOut(auth);
    router.push("/login");
  };
  return (
    <div>
      <div className="flex flex-col h-screen px-2 w-[10%] md:w-1/5 min-w-[65px] border-r-2 border-black space-y-8">

        <Link href="/" className="flex items-center text-black">
          <img src="/home.png" className="w-[40px]" />
          <span className="hidden md:inline font-bold text-xl">
            Meal<span className="text-green-500">Doctor</span>
          </span>
        </Link>
        <NavLink href="/Explore" >
          <Compass className="inline" /> <span className="hidden  md:inline ml-1">Explore</span>
        </NavLink><NavLink href="/Messages" >
          <MessageCircle className="inline" /><span className="hidden md:inline ml-1">Messages</span>
        </NavLink>
        <NavLink href="/Notifications" >
          <Bell className="inline" /><span className="hidden md:inline ml-1">Notifications</span>
        </NavLink>
        <NavLink href="/Profile" >
          <User className="inline" /> <span className="hidden md:inline ml-1">Profile</span>
        </NavLink>
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className="w-full text-left transition-all duration-300 px-2 p-2 hover:bg-gray-200 hover:rounded-lg"
          >
            <MoreHorizontal className="inline" />
            <span className="hidden md:inline ml-2">More</span>
          </button>

          {showMore && (
            <div className="absolute left-full ml-3 bottom-0 bg-white border-2 rounded-lg shadow-md w-30">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function NavLink({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        ${mobile ? "block py-3" : ""}
        transition-all duration-300 px-2 p-2
        hover:bg-gray-200 hover:rounded-lg
      `}
    >
      {children}
    </Link>
  );
}
