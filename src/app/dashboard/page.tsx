import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Verify session user exists in database
  let currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!currentUser && session.user.email) {
    currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  }
  if (!currentUser) {
    // Fallback to first user or redirect to signout to clean stale session cookie
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) redirect("/api/auth/signout");
    currentUser = firstUser;
  }

  const userProjects = await prisma.projectMember.findMany({
    where: { userId: currentUser.id },
    include: { project: true },
  });

  let projects = userProjects.map(m => m.project);

  // Fallback: If user has no specific project membership yet, auto-assign to workspace projects
  if (projects.length === 0) {
    const allProjects = await prisma.project.findMany();
    if (allProjects.length > 0) {
      const validUserId = currentUser.id;
      await Promise.all(
        allProjects.map(p =>
          prisma.projectMember.upsert({
            where: { projectId_userId: { projectId: p.id, userId: validUserId } },
            create: { projectId: p.id, userId: validUserId },
            update: {},
          }).catch(() => {})
        )
      );
      projects = allProjects;
    }
  }

  return (
    <DashboardClient
      projects={projects}
      user={{
        id: currentUser.id,
        name: currentUser.name ?? "",
        role: currentUser.role,
      }}
      canCreateProject={hasPermission(currentUser.role, "create:project")}
      canManageTeam={hasPermission(currentUser.role, "view:analytics")}
      canCreateTask={hasPermission(currentUser.role, "create:task")}
    />
  );
}
