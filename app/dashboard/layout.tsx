
import Link from "next/link";
import { signOut, getCurrentUser } from "@/app/actions/auth";
import { ProfileProvider } from "@/components/profileprovider";
import UserAvatar from "@/components/useravatar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <ProfileProvider>
      <div className="flex min-h-screen bg-gray-100 text-gray-900">
        {/* Sidebar */}
        <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white p-5">
          <h2 className="mb-8 text-xl font-bold text-blue-600">
            User Panel
          </h2>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="rounded-lg p-3 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/projects"
              className="rounded-lg p-3 transition hover:bg-blue-50 hover:text-blue-600"
            >
              All Projects
            </Link>

            <Link
              href="/dashboard/projects/new"
              className="rounded-lg p-3 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Add Project
            </Link>

            <Link
              href="/dashboard/profile"
              className="rounded-lg p-3 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Profile
            </Link>

               <Link
              href="/dashboard/picture"
              className="rounded-lg p-3 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Picture
            </Link>

          </nav>

          {/* Logout */}
          <form action={signOut} className="mt-auto border-t border-gray-200 pt-5">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700"
            >
              Logout
            </button>
          </form>
        </aside>

        {/* Main Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-16 items-center justify-end gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
            <span className="text-sm text-gray-600">
              Hello,{" "}
              <b className="text-gray-900">
                {user?.name ?? "User"}
              </b>
            </span>

            <UserAvatar name={user?.name ?? "User"} />
          </header>

          {/* Page Content */}
          <main className="min-w-0 flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProfileProvider>
  );
}
