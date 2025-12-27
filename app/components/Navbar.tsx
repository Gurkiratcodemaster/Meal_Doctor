"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import {
  Compass,
  MessageCircle,
  User,
  Bell,
  LogOut,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="h-screen w-[220px] border border-white/10 bg-black/40 backdrop-blur-xl p-4 flex flex-col gap-6">
      
      <Link href="/" className="text-xl font-bold text-white">
        Meal<span className="text-green-500">Doctor</span>
      </Link>

      <nav className="flex flex-col gap-2 text-sm">
        <NavItem href="/feed" icon={<Home />} label="Feed" />
        <NavItem href="/explore" icon={<Compass />} label="Explore" />
        <NavItem href="/messages" icon={<MessageCircle />} label="Messages" />
        <NavItem href="/notifications" icon={<Bell />} label="Notifications" />
        <NavItem href="/dashboard/user" icon={<User />} label="Profile" />
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2 text-red-400 hover:text-red-300 transition"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
    >
      {icon}
      {label}
    </Link>
  );
}
