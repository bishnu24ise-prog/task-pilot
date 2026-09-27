"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function createProject(workspaceId: string, name: string, description?: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasPermission(session.user?.role, "create:project")) {
    throw new Error("Unauthorized to create projects");
  }

  const cleanName = name?.trim();
  if (!cleanName) {
    throw new Error("Project name is required");
  }

  // Resolve valid workspace ID
  let targetWorkspaceId = workspaceId;
  if (!targetWorkspaceId || targetWorkspaceId === "default") {
    const wsMember = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
      include: { workspace: true }
    });
    if (!wsMember) {
      // Find or create any workspace in DB
      let firstWs = await prisma.workspace.findFirst();
      if (!firstWs) {
        firstWs = await prisma.workspace.create({
          data: {
            name: "Default Workspace",
            members: {
              create: { userId: session.user.id, role: session.user.role || "Admin" }
            }
          }
        });
      }
      targetWorkspaceId = firstWs.id;
    } else {
      targetWorkspaceId = wsMember.workspaceId;
    }
  } else {
    // Verify workspace exists
    const exists = await prisma.workspace.findUnique({ where: { id: targetWorkspaceId } });
    if (!exists) {
      let firstWs = await prisma.workspace.findFirst();
      if (!firstWs) {
        firstWs = await prisma.workspace.create({
          data: {
            name: "Default Workspace",
            members: {
              create: { userId: session.user.id, role: session.user.role || "Admin" }
            }
          }
        });
      }
      targetWorkspaceId = firstWs.id;
    }
  }

  const project = await prisma.project.create({
    data: {
      name: cleanName,
      description: description?.trim() || null,
      workspaceId: targetWorkspaceId,
      status: "ACTIVE",
      members: {
        create: { userId: session.user.id }
      }
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "CREATED_PROJECT",
      entityType: "PROJECT",
      entityId: project.id,
      details: `Project ${cleanName} created`,
      userId: session.user.id,
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
  return project;
}

export async function deleteProject(projectId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasPermission(session.user?.role, "delete:project")) {
    throw new Error("Unauthorized to delete projects");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
  return { success: true };
}

export async function updateProjectStatus(projectId: string, status: "ACTIVE" | "COMPLETED") {
  const session = await getServerSession(authOptions);

  if (!session || !hasPermission(session.user?.role, "edit:project")) {
    throw new Error("Unauthorized to update project status");
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
  return updated;
}

