import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;

  const total = userId
    ? await prisma.project.count({ where: { ownerId: userId } })
    : 0;

  const totalTasks = userId
    ? await prisma.task.count({ where: { project: { ownerId: userId } } })
    : 0;

  return (
    <div>
      <div className="flex items-start justify-end gap-5 p-8">
        <Image
          src="/2.png"
          width={50}
          height={50}
          alt="User"
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold">User Dashboard</h3>
          <h4 className="text-lg text-gray-600 mt-1">
            Welcome, {user?.name ?? user?.email ?? "User"}
          </h4>
        </div>
      </div>

      <div className="px-8 flex gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 w-56">
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 w-56">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-3xl font-bold">{totalTasks}</p>
        </div>
      </div>
    </div>
  );
}

