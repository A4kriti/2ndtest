import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { updateTask } from "@/app/actions/task";
import { TASK_STATUSES } from "@/lib/task-status";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) {
  const { id, taskId } = await params;
  const projectId = Number(id);
  const taskIdNum = Number(taskId);
  if (!projectId || !taskIdNum) notFound();

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const ownerId = data?.claims?.sub;

  const task = ownerId
    ? await prisma.task.findFirst({
        where: { id: taskIdNum, projectId, project: { ownerId } },
      })
    : null;
  if (!task) notFound();

  return (
    <section className="p-8 max-w-2xl">
      <Link
        href={`/dashboard/projects/${projectId}`}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to tasks
      </Link>

      <h1 className="text-2xl font-bold mt-2 mb-6">Edit Task</h1>

      <form
        action={updateTask}
        className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4"
      >
        <input type="hidden" name="id" value={task.id} />

        <input
          name="title"
          defaultValue={task.title}
          required
          className="border rounded p-2"
        />

        <textarea
          name="description"
          defaultValue={task.description ?? ""}
          placeholder="Description (optional)"
          rows={4}
          className="border rounded p-2"
        />

        <select name="status" defaultValue={task.status} className="border rounded p-2">
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
