import Button from "../components/Button";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow p-6 rounded-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Login</h1>

                <form className="flex flex-col space-y-4">

                    <input
                        type="email"
                        placeholder="Email"
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Link href="/login">
                        <Button className="w-full" type="submit">Login</Button>
                    </Link>
                    <Link href="/signup" className="inline-block text-center">
                        <Button type="button" className="w-full">Signup</Button>
                    </Link>

                </form>
            </div>
        </div>
    );
}
