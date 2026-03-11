// app/not-found.tsx
import { cookies } from "next/headers";
import Link from "next/link";

import ProtectedLayout from "./(protected)/layout";
import PublicLayout from "./(public)/layout";

export default async function NotFound() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isAuthenticated = !!token;
  const Layout = isAuthenticated ? ProtectedLayout : PublicLayout;

  return (
    <Layout>
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
    </Layout>
  );
}
