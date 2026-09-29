"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");
  return userId;
}

export async function createProject(formData: FormData) {
  const ownerId = await getUserId();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.project.create({ data: { name, description, ownerId } });
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/projects");
}

export async function updateProject(formData: FormData) {
  const ownerId = await getUserId();
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.project.updateMany({
    where: { id, ownerId },
    data: { name, description },
  });
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/projects");
}

export async function deleteProject(formData: FormData) {
  const ownerId = await getUserId();
  const id = Number(formData.get("id"));

  await prisma.project.deleteMany({ where: { id, ownerId } });
  revalidatePath("/dashboard", "layout");
}
