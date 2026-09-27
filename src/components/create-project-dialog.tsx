"use client";

import { useState } from "react";
import { createProject } from "@/app/actions/project";
import { toast } from "@/components/ui/toast";
import { FolderPlus, X, Loader2 } from "lucide-react";

export function CreateProjectDialog({
  workspaceId,
  canCreate,
  onCreated,
}: {
  workspaceId: string;
  canCreate: boolean;
  onCreated?: (project: { id: string; name: string; description: string | null; workspaceId: string; status: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!canCreate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || description.trim();
    if (!finalName) {
      setErrorMsg("Please enter a project name");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);
    try {
      const project = await createProject(workspaceId, finalName, description.trim() || null);
      setOpen(false);
      setName("");
      setDescription("");
      toast.add({ title: `Project "${project.name}" created!` });
      onCreated?.(project);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create project";
      setErrorMsg(msg);
      toast.add({
        type: "error",
        title: "Error",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrorMsg("");
    setName("");
    setDescription("");
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
      <button
        onClick={() => { setOpen(true); setErrorMsg(""); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
      >
        <FolderPlus className="w-3.5 h-3.5" />
        New Project
      </button>

      {open && typeof document !== "undefined" &&
        require("react-dom").createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
          >
            <div
              className="w-full max-w-md rounded-2xl p-6 space-y-5"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Create New Project</h2>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">
                    Project name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={e => { setName(e.target.value); setErrorMsg(""); }}
                    placeholder="e.g. Website Redesign"
                    autoFocus
                    style={inputStyle}
                    onFocus={e => {
                      e.target.style.border = "1px solid rgba(124,58,237,0.6)";
                      e.target.style.background = "rgba(124,58,237,0.08)";
                    }}
                    onBlur={e => {
                      e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                      e.target.style.background = "rgba(255,255,255,0.05)";
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What is this project about?"
                    rows={3}
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => {
                      e.target.style.border = "1px solid rgba(124,58,237,0.6)";
                      e.target.style.background = "rgba(124,58,237,0.08)";
                    }}
                    onBlur={e => {
                      e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                      e.target.style.background = "rgba(255,255,255,0.05)";
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...</>
                    ) : (
                      "Create Project"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

