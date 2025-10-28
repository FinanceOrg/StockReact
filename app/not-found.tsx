// app/not-found.tsx
import Link from "next/link";
import UserLayout from "@/layouts/UserLayout";

export default function NotFound() {
    return (
        <UserLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold mb-2">404 — Page not found</h1>
                <p className="text-gray-600 mb-6">
                    The page you’re looking for doesn’t exist or was moved.
                </p>
                <Link
                    href="/"
                    className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
                >
                    Back to Home
                </Link>
            </div>
        </UserLayout>
    );
}
