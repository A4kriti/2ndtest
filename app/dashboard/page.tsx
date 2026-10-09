import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getStatus } from "@/lib/task-status";
import TaskStatusChart from "@/components/chrts";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;

  const totalProjects = userId
    ? await prisma.project.count({ where: { ownerId: userId } })
    : 0;

  const todoTasks = userId
    ? await prisma.task.count({
        where: { status: "todo", project: { ownerId: userId } },
      })
    : 0;

  const pendingTasks = userId
    ? await prisma.task.count({
        where: { status: "pending", project: { ownerId: userId } },
      })
    : 0;

  const completedTasks = userId
    ? await prisma.task.count({
        where: { status: "complete", project: { ownerId: userId } },
      })
    : 0;

  const projects = userId
    ? await prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { id: "desc" },
        include: { tasks: { orderBy: { id: "asc" } } },
      })
    : [];

  // ----- Header info -----
  const displayName = user?.name ?? user?.email ?? "User";

  // Greeting based on Nepal time
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Kathmandu",
    }).format(new Date())
  );
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Dot color for each status
  const dotColor: Record<string, string> = {
    todo: "bg-gray-400",
    pending: "bg-yellow-500",
    complete: "bg-green-500",
  };

  return (
    <div className="p-8">
      {/* Greeting */}
      <h1 className="text-2xl font-semibold">
        {greeting}, {displayName}!
      </h1>
      <p className="text-gray-500 mt-1">
        Yahoo successfully Login. Okay Boss let explore, your profile.
      </p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-3xl font-bold">{totalProjects}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-500">To do Tasks</p>
          <p className="text-3xl font-bold text-gray-600">{todoTasks}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-500">Pending Tasks</p>
          <p className="text-3xl font-bold text-orange-500">{pendingTasks}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-500">Completed Tasks</p>
          <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
        </div>
      </div>

      {/* Projects + tasks list */}
      <div className="py-6">
        <h3 className="text-lg font-semibold mb-4">Your Projects</h3>

        {/* NEW: chart of To do / Pending / Complete */}
        <TaskStatusChart
          todo={todoTasks}
          pending={pendingTasks}
          complete={completedTasks}
        />

        {projects.length === 0 && <p className="text-gray-500">No projects yet.</p>}

        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Link
                  href={`/dashboard/projects/${p.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {p.name}
                </Link>
                <span className="text-xs text-gray-400">
                  {p.tasks.filter((t) => t.status === "complete").length}/
                  {p.tasks.length} done
                </span>
              </div>

              {p.tasks.length === 0 && (
                <p className="text-sm text-gray-400">No tasks yet.</p>
              )}

              <ul className="space-y-1">
                {p.tasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dotColor[t.status] ?? "bg-gray-400"
                      }`}
                    />
                    <span
                      className={
                        t.status === "complete" ? "line-through text-gray-400" : ""
                      }
                    >
                      {t.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {getStatus(t.status).label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}