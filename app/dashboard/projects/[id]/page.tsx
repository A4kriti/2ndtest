import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import {
  createTask,
  toggleTask,
  updateTask,
  deleteTask,
} from "@/app/actions/task";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const ownerId = data?.claims?.sub;

  const project = ownerId
    ? await prisma.project.findFirst({
        where: { id: Number(id), ownerId },
        include: { tasks: { orderBy: { id: "asc" } } },
      })
    : null;

  if (!project) notFound();

  return (
    <section className="p-8 max-w-3xl">
      <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:underline">
        ← Back to projects
      </Link>

      <h1 className="text-2xl font-bold mt-2">{project.name}</h1>
      <p className="text-gray-500 mb-6">{project.description}</p>

      {/* Add task */}
      <form action={createTask} className="flex gap-2 mb-6">
        <input type="hidden" name="projectId" value={project.id} />
        <input
          name="title"
          placeholder="New task"
          required
          className="flex-1 border rounded p-2 bg-white"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Task
        </button>
      </form>

      {/* Task list */}
      {project.tasks.length === 0 && <p className="text-gray-500">No tasks yet.</p>}

      {project.tasks.map((t) => (
        <div key={t.id} className="bg-white border border-gray-200 rounded-lg p-3 mb-2 flex items-center gap-3">
          <form action={toggleTask}>
            <input type="hidden" name="id" value={t.id} />
            <button
              type="submit"
              className={`px-3 py-1 rounded text-sm ${
                t.done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              {t.done ? "Done" : "To do"}
            </button>
          </form>

          <form action={updateTask} className="flex flex-1 gap-2">
            <input type="hidden" name="id" value={t.id} />
            <input
              name="title"
              defaultValue={t.title}
              required
              className={`flex-1 border rounded p-2 ${t.done ? "line-through text-gray-400" : ""}`}
            />
            <button type="submit" className="text-blue-600 hover:underline">
              Save
            </button>
          </form>

          <form action={deleteTask}>
            <input type="hidden" name="id" value={t.id} />
            <button type="submit" className="text-red-600 hover:underline">
              Delete
            </button>
          </form>
        </div>
      ))}
    </section>
  );
}
