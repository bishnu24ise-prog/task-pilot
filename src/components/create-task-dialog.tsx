"use client";

import { useState } from "react";
import { createTask } from "@/app/actions/task";
import { toast } from "@/components/ui/toast";
import { Plus, X, Loader2 } from "lucide-react";

export function CreateTaskDialog({ projectId, canCreate }: { projectId: string; canCreate: boolean }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [isLoading, setIsLoading] = useState(false);

  if (!canCreate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createTask(projectId, title, description, priority);
      setOpen(false);
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      toast.add({ title: "Task created" });
    } catch (error: unknown) {
      toast.add({ type: "error", title: "Error", description: error instanceof Error ? error.message : "Failed to create task" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.15s",
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 hover:scale-110"
        style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}
        title="Add task"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">New Task</h2>
              <button onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Task title *</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Design the onboarding flow"
                  required
                  style={inputStyle}
                  onFocus={e => { e.target.style.border = "1px solid rgba(124,58,237,0.6)"; e.target.style.background = "rgba(124,58,237,0.05)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Optional details..."
                  rows={3}
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(124,58,237,0.6)"; e.target.style.background = "rgba(124,58,237,0.05)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                />
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Priority</label>
                <div className="flex gap-2">
                  {[
                    { value: "LOW",    label: "Low",    color: "#6b7280" },
                    { value: "MEDIUM", label: "Medium", color: "#f59e0b" },
                    { value: "HIGH",   label: "High",   color: "#ef4444" },
                  ].map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                      style={{
                        background: priority === p.value ? `${p.color}20` : "rgba(255,255,255,0.04)",
                        border: priority === p.value ? `1px solid ${p.color}60` : "1px solid rgba(255,255,255,0.08)",
                        color: priority === p.value ? p.color : "#6b7280",
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                  {isLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...</> : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
