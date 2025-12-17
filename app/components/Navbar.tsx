import Link from "next/link";
import Button from "./Button";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
      
      {/* Left Links */}
      <div className="flex items-center space-x-8">
        <Link
          href="/"
          className="text-black font-medium hover:text-green-600 transition"
        >
          Home
        </Link>

        <Link
          href="/about"
          className="text-black font-medium hover:text-green-600 transition"
        >
          About
        </Link>
      </div>

      {/* Right Button */}
      <div>
        <Link href="/login">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition">
            Login
          </Button>
        </Link>
      </div>

    </nav>
  );
}
