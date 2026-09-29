import Link from "next/link";
import { signOut } from "@/app/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-blue-600">User Panel</h2>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/projects"
            className="p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            All Project
          </Link>
          <Link
            href="/dashboard/projects/new"
            className="p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Add Project
          </Link>
        </nav>

        <form action={signOut} className="mt-auto pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full p-3 rounded-lg text-center bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </form>
      </aside>

      {/* Page content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

