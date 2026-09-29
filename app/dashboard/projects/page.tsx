import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { deleteProject } from "@/app/actions/project";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  const projects = userId
    ? await prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { id: "desc" },
      })
    : [];

  return (
    <section className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">All Projects</h3>
        <Link
          href="/dashboard/projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Project
        </Link>
      </div>

      {projects.length === 0 && <p className="text-gray-500">No projects yet.</p>}

      {projects.map((p) => (
        <div
          key={p.id}
          className="bg-white border border-gray-200 rounded-lg p-4 mb-3 flex items-center justify-between"
        >
          <div>
            <Link href={`/dashboard/projects/${p.id}`} className="font-medium hover:underline">
              {p.name}
            </Link>
            <p className="text-sm text-gray-500">{p.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/projects/${p.id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
            <form action={deleteProject}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="text-red-600 hover:underline">
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </section>
  );
}
