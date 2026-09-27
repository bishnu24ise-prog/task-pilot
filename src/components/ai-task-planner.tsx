"use client";

import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "./ui/toast";
import { useRouter } from "next/navigation";

export function AITaskPlanner({ projectId }: { projectId: string }) {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsLoading(true);
    toast.add({ title: "AI Planner Started", description: "Thinking and generating tasks..." });

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, projectId }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.add({ title: "Success!", description: "AI Agent successfully planned and created the tasks." });
      setGoal("");
      // Dispatch a custom event so the KanbanBoard can re-fetch tasks
      window.dispatchEvent(new CustomEvent("ai-tasks-created", { detail: { projectId } }));
    } catch (error: any) {
      toast.add({
        type: "error",
        title: "Agent Error",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} className="flex gap-2 w-full max-w-xl mx-auto my-4 p-2 rounded-xl bg-[#141414] border border-white/10">
      <div className="flex-1 flex items-center px-2">
        <Zap className="w-4 h-4 text-purple-400 mr-2" />
        <input
          type="text"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="Enter a goal to auto-generate tasks..."
          className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !goal.trim()}
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
      >
        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Plan"}
      </button>
    </form>
  );
}
