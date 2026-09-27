import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

function getNextRunAt(frequency: string): Date {
  const now = new Date();
  if (frequency === "DAILY") {
    now.setDate(now.getDate() + 1);
  } else if (frequency === "WEEKLY") {
    now.setDate(now.getDate() + 7);
  } else if (frequency === "MONTHLY") {
    now.setMonth(now.getMonth() + 1);
  }
  return now;
}

// GET — list all scheduled goals for the current user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const goals = await prisma.scheduledGoal.findMany({
    where: { userId: session.user.id, ...(projectId ? { projectId } : {}) },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(goals);
}

// POST — create a new scheduled goal
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { goal, frequency, projectId } = await req.json();

  if (!goal || !frequency || !projectId) {
    return NextResponse.json({ error: "goal, frequency, and projectId are required" }, { status: 400 });
  }

  const scheduledGoal = await prisma.scheduledGoal.create({
    data: {
      goal,
      frequency,
      projectId,
      userId: session.user.id,
      nextRunAt: getNextRunAt(frequency),
    },
  });

  return NextResponse.json(scheduledGoal);
}

// PATCH — trigger a manual run or toggle active/inactive
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, action } = await req.json();

  if (action === "toggle") {
    const current = await prisma.scheduledGoal.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = await prisma.scheduledGoal.update({
      where: { id },
      data: { isActive: !current.isActive },
    });
    return NextResponse.json(updated);
  }

  if (action === "run") {
    const goal = await prisma.scheduledGoal.findUnique({ where: { id } });
    if (!goal) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Update last/next run time
    await prisma.scheduledGoal.update({
      where: { id },
      data: { lastRunAt: new Date(), nextRunAt: getNextRunAt(goal.frequency) },
    });

    // Trigger the agent via internal fetch
    const agentRes = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": req.headers.get("Cookie") || "" },
      body: JSON.stringify({ goal: goal.goal, projectId: goal.projectId }),
    });

    const result = await agentRes.json();
    return NextResponse.json({ success: true, tasksCreated: result.tasksCreated });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// DELETE — remove a scheduled goal
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.scheduledGoal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
