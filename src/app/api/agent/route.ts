import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goal, projectId } = await req.json();

    if (!goal || !projectId) {
      return NextResponse.json({ error: "Goal and projectId are required" }, { status: 400 });
    }

    // STEP 1: Use the LLM to REASON and PLAN — generate structured JSON task list
    const { object } = await generateObject({
      model: groq("qwen/qwen3.8-27b"),
      maxTokens: 1500,
      system: `You are an expert AI Technical Project Manager. Break down the user's goal into a highly detailed, actionable, and logical sequence of 4-7 sub-tasks.
Each task must have: 
- A concise, action-oriented title.
- A comprehensive description explaining exactly HOW to accomplish it and what technical steps are involved.
- A logical priority (LOW/MEDIUM/HIGH) based on standard software engineering practices.`,
      prompt: `Goal: "${goal}". Create 4-7 highly detailed sub-tasks.`,
      schema: z.object({
        reasoning: z.string().max(200).describe("A brief explanation of your overall technical strategy for this goal."),
        tasks: z.array(
          z.object({
            title: z.string().min(5).max(80).describe("Actionable task title"),
            description: z.string().min(15).max(300).describe("Detailed technical description of how to accomplish the task"),
            priority: z.enum(["LOW", "MEDIUM", "HIGH"]).describe("Task priority level"),
          })
        ).min(4).max(7),
      }),
    });

    // STEP 2: EXECUTE — create all planned tasks in the database
    // First verify the user actually exists in DB (session id may be stale after DB reset)
    const userExists = await prisma.user.findUnique({ where: { id: session.user.id } });
    const safeAssigneeId = userExists ? session.user.id : undefined;

    const createdTasks = [];
    for (const task of object.tasks) {
      let created;
      try {
        created = await prisma.task.create({
          data: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: "TODO",
            projectId,
            assigneeId: safeAssigneeId,
          },
        });
      } catch {
        // If FK fails (e.g. stale assigneeId), retry without assignee
        created = await prisma.task.create({
          data: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: "TODO",
            projectId,
          },
        });
      }

      try {
        await prisma.activityLog.create({
          data: {
            action: "AI_CREATED_TASK",
            entityType: "TASK",
            entityId: created.id,
            details: `AI Agent created task "${task.title}" from goal: "${goal}"`,
            userId: session.user.id,
            taskId: created.id,
          },
        });
      } catch {
        // Activity log failure should not block task creation
      }

      createdTasks.push({ id: created.id, title: task.title });
    }

    return NextResponse.json({
      text: `Agent reasoning: ${object.reasoning}\n\nCreated ${createdTasks.length} tasks successfully.`,
      tasksCreated: createdTasks,
    });

  } catch (error: any) {
    console.error("Agent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
