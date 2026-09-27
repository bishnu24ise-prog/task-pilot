"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/kanban-board";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { AITaskPlanner } from "@/components/ai-task-planner";
import { SchedulerPanel } from "@/components/scheduler-panel";
import { deleteProject, updateProjectStatus } from "@/app/actions/project";
import { toast } from "@/components/ui/toast";
import Link from "next/link";
import { GitBranch, Users, FolderKanban, LogOut, ChevronDown, Check, CheckCircle2, Trash2, AlertTriangle, Loader2 } from "lucide-react";

type Project = { id: string; name: string; description: string | null; workspaceId: string; status?: string };
type User    = { id: string; name: string; role: string };

export function DashboardClient({
  projects: initialProjects,
  user,
  canCreateProject,
  canManageTeam,
  canCreateTask,
}: {
  projects: Project[];
  user: User;
  canCreateProject: boolean;
  canManageTeam: boolean;
  canCreateTask: boolean;
}) {
  const [projects, setProjects]           = useState<Project[]>(initialProjects);
  const [activeProject, setActiveProject] = useState<Project | null>(initialProjects[0] ?? null);
  const [switcherOpen, setSwitcherOpen]   = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Called when a new project is created — add to list & switch to it immediately
  const handleProjectCreated = (project: Project) => {
    setProjects(prev => {
      const exists = prev.some(p => p.id === project.id);
      return exists ? prev : [...prev, project];
    });
    setActiveProject(project);
  };

  // Toggle status between ACTIVE and COMPLETED
  const handleToggleStatus = async () => {
    if (!activeProject) return;
    const newStatus = activeProject.status === "COMPLETED" ? "ACTIVE" : "COMPLETED";
    setIsUpdatingStatus(true);
    try {
      await updateProjectStatus(activeProject.id, newStatus);
      const updated = { ...activeProject, status: newStatus };
      setActiveProject(updated);
      setProjects(prev => prev.map(p => p.id === activeProject.id ? updated : p));
      toast.add({ title: `Project marked as ${newStatus === "COMPLETED" ? "Completed" : "Active"}` });
    } catch (error: unknown) {
      toast.add({
        type: "error",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project status",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Delete project
  const handleDeleteProject = async () => {
    if (!activeProject) return;
    setIsDeleting(true);
    try {
      await deleteProject(activeProject.id);
      toast.add({ title: `Project "${activeProject.name}" deleted` });
      
      const updatedProjects = projects.filter(p => p.id !== activeProject.id);
      setProjects(updatedProjects);
      setActiveProject(updatedProjects[0] ?? null);
      setDeleteConfirmOpen(false);
    } catch (error: unknown) {
      toast.add({
        type: "error",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6" style={{ background: "#080808" }}>
        <div className="text-center space-y-4 p-12 rounded-2xl max-w-md w-full"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <FolderKanban className="w-12 h-12 text-purple-500 mx-auto" />
          <h1 className="text-2xl font-bold text-white">No projects yet</h1>
          <p className="text-gray-400 mb-4">Create your first project to start managing tasks.</p>
          {canCreateProject && (
            <CreateProjectDialog
              workspaceId={"default"}
              canCreate={true}
              onCreated={handleProjectCreated}
            />
          )}
        </div>
      </div>
    );
  }

  const isCompleted = activeProject.status === "COMPLETED";

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#080808" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-6 py-3 z-10"
        style={{
          background: "rgba(10,10,10,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Left: Logo + project switcher + controls */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              <GitBranch className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">Task Pilot</span>
          </Link>

          <div className="w-px h-5 hidden sm:block" style={{ background: "rgba(255,255,255,0.1)" }} />

          {/* Project switcher */}
          <div className="relative">
            <button
              onClick={() => setSwitcherOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCompleted ? "bg-emerald-400" : "bg-purple-400"}`} />
              <span className="text-sm font-semibold text-white max-w-[160px] truncate">
                {activeProject.name}
              </span>
              {isCompleted && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Done
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            </button>

            {switcherOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSwitcherOpen(false)} />
                <div
                  className="absolute left-0 top-full mt-2 z-50 rounded-xl overflow-hidden py-1"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                    minWidth: "220px",
                  }}
                >
                  <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                    Your Projects
                  </div>
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setActiveProject(p); setSwitcherOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                    >
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-200 truncate">{p.name}</span>
                      {p.status === "COMPLETED" && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400">Done</span>
                      )}
                      {p.id === activeProject.id && (
                        <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                  {canCreateProject && (
                    <>
                      <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div className="px-3 py-1.5">
                        <CreateProjectDialog
                          workspaceId={activeProject.workspaceId}
                          canCreate={true}
                          onCreated={p => { handleProjectCreated(p); setSwitcherOpen(false); }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Project controls: Mark as Complete / Delete */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              disabled={isUpdatingStatus}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isCompleted
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:text-white hover:bg-white/10"
              }`}
              title={isCompleted ? "Reactivate Project" : "Mark Project as Completed"}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isCompleted ? "Completed" : "Mark Complete"}</span>
            </button>

            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: actions + user */}
        <div className="flex items-center gap-3">
          {canCreateProject && (
            <CreateProjectDialog
              workspaceId={activeProject.workspaceId}
              canCreate={true}
              onCreated={handleProjectCreated}
            />
          )}

          <SchedulerPanel projectId={activeProject.id} />

          {canManageTeam && (
            <Link href="/team"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
              <Users className="w-3.5 h-3.5" />
              Team
            </Link>
          )}

          <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.1)" }} />

          {/* User avatar */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-white leading-none">{user.name}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#a78bfa" }}>{user.role}</div>
            </div>
          </div>

          <Link href="/api/auth/signout"
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 transition-colors"
            title="Sign out">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── KANBAN BOARD ──────────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <AITaskPlanner projectId={activeProject.id} />
        <KanbanBoard
          key={activeProject.id}
          projectId={activeProject.id}
          canCreateTask={canCreateTask}
        />
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.12)" }}>
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Delete Project</h3>
                <p className="text-xs text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-gray-300">
              Are you sure you want to delete <span className="font-semibold text-white">&quot;{activeProject.name}&quot;</span> and all its tasks?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-all disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

