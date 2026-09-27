const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with full task set...");

  // Clean up existing data
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // Create Users with different global roles
  const admin = await prisma.user.create({
    data: {
      name: "Alice Admin",
      email: "admin@detask.com",
      password: passwordHash,
      role: "Admin",
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Bob Manager",
      email: "manager@detask.com",
      password: passwordHash,
      role: "Manager",
    },
  });

  const member1 = await prisma.user.create({
    data: {
      name: "Charlie Member",
      email: "member1@detask.com",
      password: passwordHash,
      role: "Member",
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: "Diana Member",
      email: "member2@detask.com",
      password: passwordHash,
      role: "Member",
    },
  });

  console.log("Users created.");

  // Create a Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Detask HQ",
    },
  });

  // Add members to workspace
  const workspaceMembersData = [
    { workspaceId: workspace.id, userId: admin.id, role: "Admin" },
    { workspaceId: workspace.id, userId: manager.id, role: "Manager" },
    { workspaceId: workspace.id, userId: member1.id, role: "Member" },
    { workspaceId: workspace.id, userId: member2.id, role: "Member" },
  ];
  await Promise.all(workspaceMembersData.map(data => prisma.workspaceMember.create({ data })));

  console.log("Workspace and members created.");

  // Create Primary Project 1: Hackathon Submission
  const project1 = await prisma.project.create({
    data: {
      name: "Hackathon Submission",
      description: "Build the best collaborative task management app.",
      workspaceId: workspace.id,
      status: "ACTIVE",
    },
  });

  // Create Project 2: Mobile App Redesign
  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App Redesign",
      description: "iOS and Android native mobile app revamp.",
      workspaceId: workspace.id,
      status: "ACTIVE",
    },
  });

  // Add members to projects
  const projectMembersData = [
    { projectId: project1.id, userId: admin.id },
    { projectId: project1.id, userId: manager.id },
    { projectId: project1.id, userId: member1.id },
    { projectId: project1.id, userId: member2.id },
    { projectId: project2.id, userId: admin.id },
    { projectId: project2.id, userId: manager.id },
  ];
  await Promise.all(projectMembersData.map(data => prisma.projectMember.create({ data })));

  // Tasks for Project 1 (Hackathon Submission)
  const task1 = await prisma.task.create({
    data: {
      title: "Build Drag & Drop Kanban",
      description: "Integrate fluid touch and mouse dnd-kit interactions.",
      status: "TODO",
      priority: "HIGH",
      projectId: project1.id,
      assigneeId: member1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Setup SQLite & Prisma Migrations",
      description: "Draft relational database schema for tasks and projects.",
      status: "TODO",
      priority: "MEDIUM",
      projectId: project1.id,
      assigneeId: member2.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "Configure Error Monitoring",
      description: "Integrate error tracking and performance telemetry.",
      status: "TODO",
      priority: "LOW",
      projectId: project1.id,
      assigneeId: admin.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: "Implement RBAC Middleware",
      description: "Server-side permission checks for Admin, Manager, and Member roles.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      projectId: project1.id,
      assigneeId: manager.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: "Real-time Syncing Engine",
      description: "Live task status broadcasts across active user sessions.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      projectId: project1.id,
      assigneeId: admin.id,
    },
  });

  const task6 = await prisma.task.create({
    data: {
      title: "Export Kanban Tasks to JSON",
      description: "Provide one-click backup and export capabilities for project tasks.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      projectId: project1.id,
      assigneeId: member2.id,
    },
  });

  const task7 = await prisma.task.create({
    data: {
      title: "Design Database Schema",
      description: "Draft the Prisma schema with SQLite.",
      status: "DONE",
      priority: "HIGH",
      projectId: project1.id,
      assigneeId: admin.id,
    },
  });

  const task8 = await prisma.task.create({
    data: {
      title: "User Auth & NextAuth JWT Setup",
      description: "Credentials provider with bcrypt password hashing.",
      status: "DONE",
      priority: "HIGH",
      projectId: project1.id,
      assigneeId: admin.id,
    },
  });

  const task9 = await prisma.task.create({
    data: {
      title: "Activity Audit Logging System",
      description: "Full event logging for task creation, deletion, and updates.",
      status: "DONE",
      priority: "MEDIUM",
      projectId: project1.id,
      assigneeId: manager.id,
    },
  });

  // Comments for tasks
  const commentsData = [
    { content: "Let's make sure we use dnd-kit for smooth drag animations.", taskId: task1.id, userId: manager.id },
    { content: "Added indexes on projectId and assigneeId for fast lookups.", taskId: task2.id, userId: member2.id },
    { content: "Role guards added to all server actions in /actions.", taskId: task4.id, userId: admin.id },
    { content: "Verified schema integrity and foreign key constraints.", taskId: task7.id, userId: admin.id },
  ];
  await Promise.all(commentsData.map(data => prisma.comment.create({ data })));

  // Activity logs
  const activityData = [
    { action: "CREATED_TASK", entityType: "TASK", entityId: task1.id, details: "Created task: Build Drag & Drop Kanban", userId: member1.id },
    { action: "CREATED_TASK", entityType: "TASK", entityId: task4.id, details: "Created task: Implement RBAC Middleware", userId: manager.id },
    { action: "UPDATED_STATUS", entityType: "TASK", entityId: task7.id, details: "Moved task to DONE", userId: admin.id },
  ];
  await Promise.all(activityData.map(data => prisma.activityLog.create({ data })));

  console.log("Seeding complete!");
  console.log("Admin: admin@detask.com / password123");
  console.log("Manager: manager@detask.com / password123");
  console.log("Member: member1@detask.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

