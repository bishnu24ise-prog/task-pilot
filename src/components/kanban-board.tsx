"use client";

import React, { useEffect, useRef, useState } from "react";
import { getTasks, updateTaskStatus } from "@/app/actions/task";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Pusher from "pusher-js";
import { CreateTaskDialog } from "./create-task-dialog";
import { TaskDetailsDialog } from "./task-details-dialog";
import { Plus, MessageSquare, AlertCircle, ChevronUp, Minus } from "lucide-react";

const COLUMNS = [
  { id: "TODO",        label: "To Do",       color: "#6366f1", glow: "rgba(99,102,241,0.15)"  },
  { id: "IN_PROGRESS", label: "In Progress", color: "#f59e0b", glow: "rgba(245,158,11,0.15)"  },
  { id: "DONE",        label: "Done",        color: "#10b981", glow: "rgba(16,185,129,0.15)"  },
];

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  HIGH:   { color: "#ef4444", bg: "rgba(239,68,68,0.12)",    icon: <AlertCircle className="w-2.5 h-2.5" />, label: "High"   },
  MEDIUM: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",   icon: <ChevronUp   className="w-2.5 h-2.5" />, label: "Medium" },
  LOW:    { color: "#6b7280", bg: "rgba(107,114,128,0.12)",   icon: <Minus       className="w-2.5 h-2.5" />, label: "Low"    },
};

export function KanbanBoard({ projectId, canCreateTask }: { projectId: string; canCreateTask: boolean }) {
  const dragOccurred = useRef(false);

  const [tasks, setTasks] = useState<{
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    assignee?: { name: string | null } | null;
    comments?: { id: string }[];
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      const data = await getTasks(projectId);
      setTasks(data);
      setLoading(false);
    }
    loadTasks();

    // Listen for AI agent task creation and reload
    const handleAiTasksCreated = () => loadTasks();
    window.addEventListener("ai-tasks-created", handleAiTasksCreated);

    // Listen for local manual UI events
    const handleTaskCreated = (e: any) => setTasks(p => [e.detail, ...p]);
    const handleTaskDeleted = (e: any) => setTasks(p => p.filter(t => t.id !== e.detail.taskId));
    const handleCommentAdded = (e: any) => {
      setTasks(p => p.map(t => t.id === e.detail.taskId ? { ...t, comments: [...(t.comments || []), e.detail.comment] } : t));
    };

    window.addEventListener("manual-task-created", handleTaskCreated);
    window.addEventListener("manual-task-deleted", handleTaskDeleted);
    window.addEventListener("manual-comment-added", handleCommentAdded);

    if (process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });

      const channel = pusher.subscribe(`project-${projectId}`);
      channel.bind("task-updated",  (t: typeof tasks[0])                      => setTasks(p => p.map(x => x.id === t.id ? { ...x, ...t } : x)));
      channel.bind("task-created",  (t: typeof tasks[0])                      => setTasks(p => [t, ...p]));
      channel.bind("task-deleted",  ({ taskId }: { taskId: string })           => setTasks(p => p.filter(x => x.id !== taskId)));
      channel.bind("comment-added", ({ taskId, comment }: { taskId: string; comment: { id: string } }) =>
        setTasks(p => p.map(t => t.id === taskId ? { ...t, comments: [...(t.comments || []), comment] } : t))
      );

      return () => {
        window.removeEventListener("ai-tasks-created", handleAiTasksCreated);
        window.removeEventListener("manual-task-created", handleTaskCreated);
        window.removeEventListener("manual-task-deleted", handleTaskDeleted);
        window.removeEventListener("manual-comment-added", handleCommentAdded);
        pusher.unsubscribe(`project-${projectId}`);
      };
    } else {
      return () => {
        window.removeEventListener("ai-tasks-created", handleAiTasksCreated);
        window.removeEventListener("manual-task-created", handleTaskCreated);
        window.removeEventListener("manual-task-deleted", handleTaskDeleted);
        window.removeEventListener("manual-comment-added", handleCommentAdded);
      };
    }
  }, [projectId]);

  const onDragEnd = async (result: DropResult) => {
    setDragging(false);
    // Mark that a drag occurred so the card onClick suppresses the dialog open
    if (result.destination && result.source.droppableId !== result.destination.droppableId) {
      dragOccurred.current = true;
    }
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    setTasks(p => p.map(t => t.id === draggableId ? { ...t, status: newStatus } : t));

    try {
      await updateTaskStatus(draggableId, newStatus, projectId);
    } catch {
      const data = await getTasks(projectId);
      setTasks(data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: "#080808" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-sm">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext
      onDragStart={() => setDragging(true)}
      onDragEnd={onDragEnd}
    >
      <div
        className="flex gap-5 p-5 overflow-x-auto h-full"
        style={{ background: "#080808", alignItems: "flex-start" }}
      >
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col flex-shrink-0"
                  style={{
                    width: "320px",
                    minHeight: "calc(100vh - 120px)",
                    background: snapshot.isDraggingOver
                      ? `rgba(${col.id === "TODO" ? "99,102,241" : col.id === "IN_PROGRESS" ? "245,158,11" : "16,185,129"},0.06)`
                      : "rgba(255,255,255,0.025)",
                    border: `1px solid ${snapshot.isDraggingOver ? col.color + "40" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: "16px",
                    padding: "16px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.color, boxShadow: `0 0 6px ${col.color}` }} />
                      <span className="text-sm font-semibold text-white">{col.label}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}>
                        {colTasks.length}
                      </span>
                    </div>
                    {col.id === "TODO" && (
                      <CreateTaskDialog projectId={projectId} canCreate={canCreateTask} />
                    )}
                  </div>

                  {/* Tasks */}
                  <div className="flex flex-col gap-3 flex-1">
                    {colTasks.map((task, index) => {
                      const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
                      return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(drag, dragSnap) => (
                            <div
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              {...drag.dragHandleProps}
                            >
                              <TaskDetailsDialog task={task} projectId={projectId} canDelete={canCreateTask} />
                              {/* Card — clicking opens the details modal (but not after a drag) */}
                              <div
                                className="group rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all duration-150"
                                onClick={() => {
                                  if (dragOccurred.current) {
                                    dragOccurred.current = false;
                                    return;
                                  }
                                  const trigger = document.getElementById(`task-trigger-${task.id}`);
                                  if (trigger) trigger.click();
                                }}
                                style={{
                                  background: dragSnap.isDragging
                                    ? "rgba(124,58,237,0.15)"
                                    : "rgba(255,255,255,0.04)",
                                  border: dragSnap.isDragging
                                    ? "1px solid rgba(124,58,237,0.5)"
                                    : "1px solid rgba(255,255,255,0.07)",
                                  boxShadow: dragSnap.isDragging
                                    ? "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(124,58,237,0.2)"
                                    : "none",
                                  transform: dragSnap.isDragging ? "rotate(2deg)" : "none",
                                }}
                                onMouseEnter={e => {
                                  if (!dragSnap.isDragging) {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                                    (e.currentTarget as HTMLElement).style.border = `1px solid ${col.color}30`;
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (!dragSnap.isDragging) {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                                  }
                                }}
                              >
                                {/* Task title */}
                                <p className="text-sm font-medium text-white leading-snug mb-3">{task.title}</p>

                                {/* Description preview */}
                                {task.description && (
                                  <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{task.description}</p>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-1">
                                  {/* Priority badge */}
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                                    style={{ background: priority.bg, color: priority.color }}>
                                    {priority.icon}
                                    {priority.label}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    {/* Comment count */}
                                    {(task.comments?.length ?? 0) > 0 && (
                                      <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <MessageSquare className="w-3 h-3" />
                                        {task.comments!.length}
                                      </span>
                                    )}
                                    {/* Assignee avatar */}
                                    {task.assignee && (
                                      <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                                        title={task.assignee.name ?? ""}
                                      >
                                        {task.assignee.name?.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}

                    {/* Empty state */}
                    {colTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-10 rounded-xl"
                        style={{ border: "1px dashed rgba(255,255,255,0.07)" }}>
                        {col.id === "TODO" && canCreateTask ? (
                          <div className="text-center">
                            <Plus className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-600">Add your first task</p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-700">No tasks here</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
