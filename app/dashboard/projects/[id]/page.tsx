import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { updateTaskStatus, deleteTask } from "@/app/actions/task";
import { TASK_STATUSES, getStatus } from "@/lib/task-status";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);
  if (!projectId) notFound();

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const ownerId = data?.claims?.sub;

  const project = ownerId
    ? await prisma.project.findFirst({
        where: { id: projectId, ownerId },
        include: { tasks: { orderBy: { id: "asc" } } },
      })
    : null;

  if (!project) notFound();

  return (
    <section className="p-8">
      <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:underline">
        ← Back to projects
      </Link>

      <div className="flex items-center justify-between mt-2 mb-1">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <Link
          href={`/dashboard/projects/${project.id}/tasks/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </Link>
      </div>
      <p className="text-gray-500 mb-6">{project.description}</p>

      {project.tasks.length === 0 && <p className="text-gray-500">No tasks yet.</p>}

      {project.tasks.map((t) => {
        const status = getStatus(t.status);

        return (
          <div
            key={t.id}
            className="bg-white border border-gray-200 rounded-lg p-4 mb-2 flex items-center gap-4"
          >
            {/* Colored status badge */}
            <span className={`px-3 py-1 rounded text-sm w-24 text-center ${status.style}`}>
              {status.label}
            </span>

            {/* Title and description */}
            <div className="flex-1">
              <p className={t.status === "complete" ? "line-through text-gray-400" : ""}>
                {t.title}
              </p>
              {t.description && (
                <p className="text-sm text-gray-500">{t.description}</p>
              )}
            </div>

            {/* Change status: pick one, then click Update */}
            <form action={updateTaskStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={t.id} />
              <select
                name="status"
                defaultValue={t.status}
                className="border rounded p-1 text-sm"
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button type="submit" className="text-sm text-gray-600 hover:underline">
                Update
              </button>
            </form>

            <Link
              href={`/dashboard/projects/${project.id}/tasks/${t.id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>

            <form action={deleteTask}>
              <input type="hidden" name="id" value={t.id} />
              <button type="submit" className="text-red-600 hover:underline">
                Delete
              </button>
            </form>
          </div>
        );
      })}
    </section>
  );
}
