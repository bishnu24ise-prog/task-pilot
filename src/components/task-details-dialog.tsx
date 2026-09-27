"use client";

import { useState } from "react";
import { addComment, deleteTask } from "@/app/actions/task";
import { X, Trash2, MessageSquare, Loader2, User } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assignee?: { name: string | null } | null;
  comments?: { id: string; content: string; user?: { name: string | null } | null; createdAt?: string }[];
};

const PRIORITY_STYLE: Record<string, { color: string; bg: string }> = {
  HIGH:   { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  MEDIUM: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  LOW:    { color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
};

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  TODO:        { color: "#6366f1", label: "To Do" },
  IN_PROGRESS: { color: "#f59e0b", label: "In Progress" },
  DONE:        { color: "#10b981", label: "Done" },
};

export function TaskDetailsDialog({
  task,
  projectId,
  canDelete,
}: {
  task: Task;
  projectId: string;
  canDelete: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priority = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.MEDIUM;
  const status = STATUS_STYLE[task.status] || STATUS_STYLE.TODO;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment(task.id, commentText, projectId);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteTask(task.id, projectId);
      setOpen(false);
    } catch (err) {
      console.error("Failed to delete task", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Invisible trigger — opened programmatically by card onClick */}
      <span id={`task-trigger-${task.id}`} style={{ display: "none" }} onClick={() => setOpen(true)} />

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
              maxHeight: "85vh",
            }}
          >
            {/* Header */}
            <div className="p-6 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white leading-snug">{task.title}</h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Status */}
                    <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: `${status.color}15`, color: status.color, border: `1px solid ${status.color}30` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
                      {status.label}
                    </span>
                    {/* Priority */}
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: priority.bg, color: priority.color }}>
                      {task.priority}
                    </span>
                    {/* Assignee */}
                    {task.assignee && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                          {task.assignee.name?.charAt(0).toUpperCase()}
                        </div>
                        {task.assignee.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete task"
                    >
                      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">{task.description}</p>
              )}
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Comments ({task.comments?.length ?? 0})
              </h3>

              {(task.comments?.length ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 rounded-xl"
                  style={{ border: "1px dashed rgba(255,255,255,0.07)" }}>
                  <MessageSquare className="w-5 h-5 text-gray-700 mb-2" />
                  <p className="text-xs text-gray-700">No comments yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {task.comments?.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                        {comment.user?.name?.charAt(0).toUpperCase() ?? <User className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-300">{comment.user?.name ?? "Unknown"}</span>
                        </div>
                        <div className="text-sm text-gray-400 leading-relaxed p-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment input */}
            <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(124,58,237,0.5)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.09)"; }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Post"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
