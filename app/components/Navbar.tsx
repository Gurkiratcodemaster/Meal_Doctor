"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import {
  Compass,
  MessageCircle,
  User,
  Bell,
  LogOut,
  Home,
} from "lucide-react";

export default function Navbar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="
          fixed left-0 top-0 z-50
          h-screen w-56
          bg-white dark:bg-zinc-950
          border-r border-black/15 dark:border-green-500/20
          hidden md:flex
          flex-col
          px-4 py-5
        "
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-10">
          <Image src="/home.png" alt="Meal Doctor Logo" width={36} height={36} />
          <span className="text-xl font-bold text-black dark:text-green-500">
            Meal<span className="text-black dark:text-green-400">Doctor</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          <NavItem href="/feed" icon={Home} label="Feed" pathname={pathname} />
          <NavItem href="/explore" icon={Compass} label="Explore" pathname={pathname} />
          <NavItem href="/messages" icon={MessageCircle} label="Messages" pathname={pathname} />
          <NavItem href="/notifications" icon={Bell} label="Notifications" pathname={pathname} />
          <NavItem href="/profile" icon={User} label="Profile" pathname={pathname} />
        </nav>

        <button
          onClick={logout}
          className="
            mt-auto
            flex items-center gap-3
            px-3 py-2
            rounded-lg
            text-black dark:text-green-500
            hover:bg-black/20 dark:hover:bg-black/30
            transition
          "
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          bg-white dark:bg-zinc-950
          border-t border-black/15 dark:border-green-500/20
          flex md:hidden
          justify-around
          py-2
        "
      >
        <MobileItem href="/feed" icon={Home} pathname={pathname} />
        <MobileItem href="/explore" icon={Compass} pathname={pathname} />
        <MobileItem href="/messages" icon={MessageCircle} pathname={pathname} />
        <MobileItem href="/notifications" icon={Bell} pathname={pathname} />
        <MobileItem href="/profile" icon={User} pathname={pathname} />
      </nav>
    </>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  pathname,
}: {
  href: string;
  icon: any;
  label: string;
  pathname: string;
}) {
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        relative
        flex items-center gap-3
        px-3 py-2
        rounded-lg
        transition
        ${
          active
            ? "bg-black/20 text-black dark:bg-green-500/20 dark:text-green-400"
            : "text-black dark:text-green-500 hover:bg-black/20 dark:hover:bg-black/30"
        }
      `}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-black dark:bg-green-500 rounded-full" />
      )}

      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function MobileItem({
  href,
  icon: Icon,
  pathname,
}: {
  href: string;
  icon: any;
  pathname: string;
}) {
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        p-2 rounded-xl transition
        ${
          active
            ? "bg-black/25 text-black dark:bg-green-500/30 dark:text-green-400"
            : "text-black dark:text-green-500 hover:bg-black/20 dark:hover:bg-black/30"
        }
      `}
    >
      <Icon className="w-6 h-6" />
    </Link>
  );
}
