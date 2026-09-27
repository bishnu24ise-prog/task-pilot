"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "mock-id",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "mock-key",
  secret: process.env.PUSHER_SECRET || "mock-secret",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mock-cluster",
  useTLS: true,
});

export async function updateTaskStatus(taskId: string, newStatus: string, projectId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasPermission(session.user?.role, "update:task_status")) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  await prisma.activityLog.create({
    data: {
      action: "UPDATED_STATUS",
      entityType: "TASK",
      entityId: task.id,
      details: `Status changed to ${newStatus}`,
      userId: session.user.id,
      taskId: task.id,
    }
  });

  // Trigger real-time update via Pusher
  try {
    await pusher.trigger(`project-${projectId}`, "task-updated", task);
  } catch (error) {
    console.error("Pusher error:", error);
  }

  return task;
}

export async function getTasks(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  return prisma.task.findMany({
    where: { projectId },
    include: { assignee: true, comments: { include: { user: true }, orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTask(projectId: string, title: string, description?: string, priority?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission(session.user?.role, "create:task")) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      projectId,
      status: "TODO",
      priority: priority ?? "MEDIUM",
    },
    include: { assignee: true, comments: { include: { user: true } } }
  });

  try {
    await pusher.trigger(`project-${projectId}`, "task-created", task);
  } catch (error) {
    console.error("Pusher error:", error);
  }

  return task;
}

export async function addComment(taskId: string, content: string, projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission(session.user?.role, "create:comment")) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      taskId,
      userId: session.user.id,
    },
    include: { user: true }
  });

  try {
    await pusher.trigger(`project-${projectId}`, "comment-added", { taskId, comment });
  } catch (error) {
    console.error("Pusher error:", error);
  }

  return comment;
}

export async function deleteTask(taskId: string, projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission(session.user?.role, "delete:task")) {
    throw new Error("Unauthorized");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  try {
    await pusher.trigger(`project-${projectId}`, "task-deleted", { taskId });
  } catch (error) {
    console.error("Pusher error:", error);
  }
}
