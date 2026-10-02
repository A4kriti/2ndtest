"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { TASK_STATUSES } from "@/lib/task-status";

async function getUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");
  return userId;
}

// Make sure the status is one of the allowed values
function cleanStatus(value: FormDataEntryValue | null) {
  const status = String(value ?? "");
  return TASK_STATUSES.some((s) => s.value === status) ? status : "todo";
}

function parseTaskFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const status = cleanStatus(formData.get("status"));
  return { title, description, status };
}

// ADD a task
export async function createTask(formData: FormData) {
  const userId = await getUserId();
  const projectId = Number(formData.get("projectId"));
  const { title, description, status } = parseTaskFields(formData);
  if (!title || !projectId) return;

  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
  });
  if (!project) return;

  await prisma.task.create({
    data: { title, description, status, projectId },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}

// CHANGE only the status (used from the task list)
export async function updateTaskStatus(formData: FormData) {
  const userId = await getUserId();
  const id = Number(formData.get("id"));
  const status = cleanStatus(formData.get("status"));

  const task = await prisma.task.findFirst({
    where: { id, project: { ownerId: userId } },
  });
  if (!task) return;

  await prisma.task.update({ where: { id }, data: { status } });
  revalidatePath(`/dashboard/projects/${task.projectId}`);
}

// EDIT a task (title, description, status)
export async function updateTask(formData: FormData) {
  const userId = await getUserId();
  const id = Number(formData.get("id"));
  const { title, description, status } = parseTaskFields(formData);
  if (!title || !id) return;

  const task = await prisma.task.findFirst({
    where: { id, project: { ownerId: userId } },
  });
  if (!task) return;

  await prisma.task.update({
    where: { id },
    data: { title, description, status },
  });

  revalidatePath(`/dashboard/projects/${task.projectId}`);
  redirect(`/dashboard/projects/${task.projectId}`);
}

// DELETE a task
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
