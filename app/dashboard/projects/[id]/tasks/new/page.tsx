import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createTask } from "@/app/actions/task";
import { TASK_STATUSES } from "@/lib/task-status";

export default async function NewTaskPage({
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
    ? await prisma.project.findFirst({ where: { id: projectId, ownerId } })
    : null;
  if (!project) notFound();

  return (
    <section className="p-8 max-w-2xl">
      <Link
        href={`/dashboard/projects/${project.id}`}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to tasks
      </Link>

      <h1 className="text-2xl font-bold mt-2 mb-6">Add Task</h1>

      <form
        action={createTask}
        className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4"
      >
        <input type="hidden" name="projectId" value={project.id} />

        <input
          name="title"
          placeholder="Task title"
          required
          className="border rounded p-2"
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          rows={4}
          className="border rounded p-2"
        />

        <select name="status" defaultValue="todo" className="border rounded p-2">
          {TASK_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </section>
  );
}
