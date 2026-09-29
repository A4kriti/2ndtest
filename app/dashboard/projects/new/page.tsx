import Link from "next/link";
import { createProject } from "@/app/actions/project";

export default function NewProjectPage() {
  return (
    <div className="p-8">
      <form
        action={createProject}
        className="w-full max-w-md space-y-4 bg-white p-6 rounded-xl border border-gray-200"
      >
        <h1 className="text-xl font-bold">Add Project</h1>
        <input
          name="name"
          placeholder="Project name"
          required
          className="w-full border rounded p-2"
        />
        <input
          name="description"
          placeholder="Description"
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create
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
