"use client";

import { useState, useEffect } from "react";
import { Calendar, Play, Trash2, Pause, Clock, Zap, Plus, X } from "lucide-react";

interface ScheduledGoal {
  id: string;
  goal: string;
  frequency: string;
  isActive: boolean;
  lastRunAt: string | null;
  nextRunAt: string;
  createdAt: string;
}

const FREQ_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  DAILY:   { label: "Daily",   color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  WEEKLY:  { label: "Weekly",  color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  MONTHLY: { label: "Monthly", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

export function SchedulerPanel({ projectId }: { projectId: string }) {
  const [goals, setGoals] = useState<ScheduledGoal[]>([]);
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [goal, setGoal] = useState("");
  const [frequency, setFrequency] = useState("WEEKLY");
  const [loading, setLoading] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);

  const loadGoals = async () => {
    const res = await fetch(`/api/schedule?projectId=${projectId}`);
    const data = await res.json();
    setGoals(data);
  };

  useEffect(() => {
    if (open) loadGoals();
  }, [open]);

  const createGoal = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, frequency, projectId }),
    });
    setGoal("");
    setShowForm(false);
    setLoading(false);
    await loadGoals();
  };

  const toggleGoal = async (id: string) => {
    await fetch("/api/schedule", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "toggle" }),
    });
    await loadGoals();
  };

  const runNow = async (id: string) => {
    setRunningId(id);
    await fetch("/api/schedule", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "run" }),
    });
    setRunningId(null);
    window.dispatchEvent(new CustomEvent("ai-tasks-created", { detail: { projectId } }));
    await loadGoals();
  };

  const deleteGoal = async (id: string) => {
    await fetch("/api/schedule", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadGoals();
  };

  const formatDate = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
        style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}
      >
        <Calendar className="w-4 h-4" />
        Schedule
      </button>

      {/* Panel overlay - Rendered in a Portal to avoid clipping */}
      {open && typeof document !== "undefined" &&
        require("react-dom").createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
            <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)" }}>
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Scheduled Goals</h2>
                    <p className="text-xs text-gray-500">Agent runs automatically on a schedule</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Add new form */}
                {showForm ? (
                  <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <input
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      placeholder="e.g. Send weekly outreach emails to prospects"
                      className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}
                    />
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <span className="text-xs text-gray-400">Frequency:</span>
                      {["DAILY","WEEKLY","MONTHLY"].map(f => (
                        <button
                          key={f}
                          onClick={() => setFrequency(f)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: frequency === f ? FREQ_LABELS[f].bg : "rgba(255,255,255,0.04)",
                            color: frequency === f ? FREQ_LABELS[f].color : "#6b7280",
                            border: `1px solid ${frequency === f ? FREQ_LABELS[f].color + "40" : "rgba(255,255,255,0.08)"}`,
                          }}
                        >
                          {FREQ_LABELS[f].label}
                        </button>
                      ))}
                      <div className="flex-1" />
                      <button onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:text-white">Cancel</button>
                      <button
                        onClick={createGoal}
                        disabled={loading || !goal.trim()}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
                      >
                        {loading ? "Saving..." : "Save Schedule"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    style={{ border: "1px dashed rgba(255,255,255,0.2)" }}
                  >
                    <Plus className="w-4 h-4" /> Add scheduled goal
                  </button>
                )}

                {/* Goal list */}
                {goals.length === 0 && !showForm ? (
                  <div className="text-center py-10">
                    <Clock className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No scheduled goals yet.</p>
                    <p className="text-xs text-gray-600 mt-1">Schedule recurring AI runs for your project.</p>
                  </div>
                ) : (
                  goals.map(g => {
                    const freq = FREQ_LABELS[g.frequency];
                    const isRunning = runningId === g.id;
                    return (
                      <div key={g.id} className="p-4 rounded-xl transition-all" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${g.isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`, opacity: g.isActive ? 1 : 0.5 }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ background: freq.bg, color: freq.color }}>{freq.label}</span>
                              {!g.isActive && <span className="text-[10px] text-gray-600 font-semibold">PAUSED</span>}
                            </div>
                            <p className="text-sm font-medium text-white leading-snug truncate">{g.goal}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Last: {formatDate(g.lastRunAt)}
                              </span>
                              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Next: {formatDate(g.nextRunAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => runNow(g.id)}
                              disabled={isRunning}
                              title="Run now"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-emerald-500/20 disabled:opacity-50"
                              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                              {isRunning ? <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                            <button
                              onClick={() => toggleGoal(g.id)}
                              title={g.isActive ? "Pause" : "Resume"}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-indigo-500/20"
                              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                              <Pause className="w-3.5 h-3.5 text-indigo-400" />
                            </button>
                            <button
                              onClick={() => deleteGoal(g.id)}
                              title="Delete"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20"
                              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
