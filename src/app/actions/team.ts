"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission, ROLES, Role } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getTeamMembers() {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasPermission(session.user?.role, "view:analytics")) {
    throw new Error("Unauthorized");
  }

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function inviteUser(email: string, name: string, role: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasPermission(session.user?.role, "invite:user")) {
    throw new Error("Unauthorized");
  }

  if (!Object.values(ROLES).includes(role as Role)) {
    throw new Error("Invalid role");
  }

  // Dummy password for invited users, they should reset it in a real app
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role,
      password: hashedPassword
    }
  });

  revalidatePath("/team");
  return user;
}

export async function changeUserRole(userId: string, newRole: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasPermission(session.user?.role, "assign:role")) {
    throw new Error("Unauthorized");
  }

  if (!Object.values(ROLES).includes(newRole as Role)) {
    throw new Error("Invalid role");
  }

  // Prevent changing own role to avoid lockout
  if (userId === session.user.id) {
    throw new Error("Cannot change your own role");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath("/team");
}

export async function removeUser(userId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasPermission(session.user?.role, "remove:user")) {
    throw new Error("Unauthorized");
  }

  // Prevent removing self
  if (userId === session.user.id) {
    throw new Error("Cannot remove yourself");
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  revalidatePath("/team");
}
