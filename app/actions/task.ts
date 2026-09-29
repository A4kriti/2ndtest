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

export async function createTask(formData: FormData) {
  const userId = await getUserId();
  const projectId = Number(formData.get("projectId"));
  const title = formData.get("title") as string;

  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
  });
  if (!project) return;

  await prisma.task.create({ data: { title, projectId } });
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function toggleTask(formData: FormData) {
  const userId = await getUserId();
  const id = Number(formData.get("id"));

  const task = await prisma.task.findFirst({
    where: { id, project: { ownerId: userId } },
  });
  if (!task) return;

  await prisma.task.update({ where: { id }, data: { done: !task.done } });
  revalidatePath(`/dashboard/projects/${task.projectId}`);
}

export async function updateTask(formData: FormData) {
  const userId = await getUserId();
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;

  const task = await prisma.task.findFirst({
    where: { id, project: { ownerId: userId } },
  });
  if (!task) return;

  await prisma.task.update({ where: { id }, data: { title } });
  revalidatePath(`/dashboard/projects/${task.projectId}`);
}

export async function deleteTask(formData: FormData) {
  const userId = await getUserId();
  const id = Number(formData.get("id"));

  const task = await prisma.task.findFirst({
    where: { id, project: { ownerId: userId } },
  });
  if (!task) return;

  await prisma.task.delete({ where: { id } });
  revalidatePath(`/dashboard/projects/${task.projectId}`);
}
