import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { updateProject } from "@/app/actions/project";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const ownerId = data?.claims?.sub;

  const project = ownerId
    ? await prisma.project.findFirst({ where: { id: Number(id), ownerId } })
    : null;

  if (!project) notFound();

  return (
    <div className="p-8">
      <form
        action={updateProject}
        className="w-full max-w-md space-y-4 bg-white p-6 rounded-xl border border-gray-200"
      >
        <h1 className="text-xl font-bold">Edit Project</h1>
        <input type="hidden" name="id" value={project.id} />
        <input
          name="name"
          defaultValue={project.name}
          required
          className="w-full border rounded p-2"
        />
        <input
          name="description"
          defaultValue={project.description ?? ""}
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <Link
          href="/dashboard/projects"
          className="block text-center text-sm text-gray-500 hover:underline"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}

