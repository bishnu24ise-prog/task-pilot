import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  Star,
  GitBranch,
  Bell,
  Lock,
  Brain,
  Workflow,
  Target,
} from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen text-white overflow-x-hidden">

      {/* ─── NAVBAR ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4"
        style={{ background: "rgba(4,4,4,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight">Task Pilot</span>
          <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
            style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa" }}>
            AI AGENT
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#agent" className="hover:text-white transition-colors">The Agent</a>
        </div>
        <div className="flex items-center gap-3">
          {session ? (
            <Link href="/dashboard"
              className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:scale-105 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link href="/login"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2">
                Sign in
              </Link>
              <Link href="/register"
                className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 65%)" }} />
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)", color: "#c4b5fd" }}>
            <Zap className="w-3.5 h-3.5 fill-current" />
            Agentic AI — Reasoning — Planning — Tool Use — Execution
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1.0]"
            style={{ textShadow: "0 0 80px rgba(124,58,237,0.3)" }}>
            AI Task Planner.
            <br />
            <span style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Automate your goals.
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
            An intelligent Scheduler/Task Planner Agent that turns a <strong className="text-white">high-level goal</strong> into a
            detailed sub-task plan — then autonomously executes each step using
            <strong className="text-purple-300"> LLM-powered reasoning and tool calling</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {session ? (
              <Link href="/dashboard"
                className="flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:opacity-90 hover:scale-105 w-full sm:w-auto justify-center"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 40px rgba(124,58,237,0.6)" }}>
                Launch the Agent <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link href="/register"
                  className="flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:opacity-90 hover:scale-105 w-full sm:w-auto justify-center"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 40px rgba(124,58,237,0.6)" }}>
                  Launch the Agent <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/login"
                  className="flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white/10 w-full sm:w-auto justify-center"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#e5e7eb" }}>
                  Sign in to your account
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="flex -space-x-2">
              {["#7c3aed","#4f46e5","#2563eb","#0891b2","#059669"].map((c,i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-black/50"
                  style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-white font-semibold">2,000+</span> teams already using Task Pilot
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              <span className="text-sm text-gray-400 ml-1">5.0</span>
            </div>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-16 w-full max-w-5xl mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden text-left"
            style={{ border: "1px solid rgba(124,58,237,0.4)", boxShadow: "0 0 60px rgba(124,58,237,0.3), 0 80px 120px -40px rgba(0,0,0,0.9)" }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-md text-center text-xs text-gray-500 flex items-center justify-center font-mono gap-1"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <Lock className="w-3 h-3 text-emerald-400" /> app.taskpilot.io/dashboard
              </div>
            </div>

            <div className="p-4" style={{ background: "#0c0c0e" }}>
              <div className="flex gap-2 mb-4 p-2.5 rounded-xl" style={{ background: "#141414", border: "1px solid rgba(124,58,237,0.3)" }}>
                <div className="flex-1 flex items-center px-2 gap-2">
                  <Zap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Prepare for a job interview at Google</span>
                </div>
                <div className="px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 15px rgba(124,58,237,0.5)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Planning...
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="rounded-xl p-3 space-y-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 px-1 pb-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="text-xs font-bold text-gray-300">To Do</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 ml-auto">3</span>
                  </div>
                  {[
                    { t: "Research company culture", p: "HIGH", c: "#ef4444" },
                    { t: "Practice coding problems", p: "HIGH", c: "#ef4444" },
                    { t: "Prepare portfolio projects", p: "MEDIUM", c: "#f59e0b" },
                  ].map((task) => (
                    <div key={task.t} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-[11px] font-semibold text-white leading-snug">{task.t}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${task.c}20`, color: task.c, border: `1px solid ${task.c}40` }}>{task.p}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl p-3 space-y-2.5" style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <div className="flex items-center gap-2 px-1 pb-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-bold text-purple-300">In Progress</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 ml-auto">2</span>
                  </div>
                  {[
                    { t: "Mock interview with peers", p: "HIGH", c: "#ef4444" },
                    { t: "Review system design notes", p: "MEDIUM", c: "#f59e0b" },
                  ].map((task) => (
                    <div key={task.t} className="rounded-lg p-3" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)" }}>
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-[11px] font-semibold text-white leading-snug">{task.t}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${task.c}20`, color: task.c, border: `1px solid ${task.c}40` }}>{task.p}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl p-3 space-y-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 px-1 pb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-gray-300">Done</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 ml-auto">2</span>
                  </div>
                  {[
                    { t: "Update resume & LinkedIn" },
                    { t: "Set up interview schedule" },
                  ].map((task) => (
                    <div key={task.t} className="rounded-lg p-3 opacity-70" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-[11px] font-semibold text-gray-400 line-through leading-snug">{task.t}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Done</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 blur-3xl opacity-25 pointer-events-none"
            style={{ background: "linear-gradient(to right, #7c3aed, #4f46e5)" }} />
        </div>
      </section>

      {/* ─── THE AGENT SECTION ───────────────────────────────────────── */}
      <section id="agent" className="py-32 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}>
              <Brain className="w-4 h-4" /> Agentic AI System
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">
              Not just a chatbot.{" "}
              <span style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                A real Agent.
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Task Pilot implements the core principles of agentic AI — <strong className="text-white">reasoning, planning, tool use, and execution</strong> — through a structured multi-step workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl space-y-6" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Workflow className="w-5 h-5 text-purple-400" /> Agentic Workflow
              </h3>
              {[
                { step: "1", label: "Accept Goal", desc: "User provides a high-level text goal (e.g. 'Prepare for a job interview')" },
                { step: "2", label: "Reason & Plan", desc: "LLM uses chain-of-thought to break the goal into logical sub-tasks" },
                { step: "3", label: "Tool Execution", desc: "Agent calls the createTask tool multiple times to write each task to the database" },
                { step: "4", label: "State & Context", desc: "Each step builds on the last with maintained context across the full workflow" },
                { step: "5", label: "Final Output", desc: "A fully populated Kanban board ready for your team to execute" },
              ].map(({ step, label, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>{step}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-2xl space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" /> Problem Statement Checklist
              </h3>
              {[
                "Accept a task/goal from user (text-based input)",
                "Break down into a sequence of logical steps (planning)",
                "Use LLM to reason about each step and decide next action",
                "Execute actions — calling tools/APIs (createTask tool)",
                "Maintain state/context across steps of the workflow",
                "Return a final, coherent output fulfilling the original task",
                "Scheduler/Task Planner Agent type selected",
                "Triggers sub-task plan from a goal",
              ].map((label) => (
                <div key={label} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" className="py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}>
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">
            Built for the way
            <span style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {" "}agents actually work
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Brain, color: "#a855f7", bg: "rgba(168,85,247,0.1)", title: "LLM-Powered Planning", desc: "Groq Qwen model reasons step-by-step, deciding what tasks to create and in what order — true agentic planning." },
            { icon: Zap, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", title: "Goal Breakdown", desc: "Input any high-level goal and the AI instantly generates a comprehensive step-by-step sub-task plan." },
            { icon: Workflow, color: "#10b981", bg: "rgba(16,185,129,0.1)", title: "Tool Use & Execution", desc: "The agent calls the createTask tool to write tasks directly to your database — not just suggestions." },
            { icon: Users, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", title: "Team Management", desc: "Invite members, assign roles (Admin, Manager, Member), and manage your workspace with full RBAC." },
            { icon: Bell, color: "#ec4899", bg: "rgba(236,72,153,0.1)", title: "Activity Logs", desc: "Full audit trail of every automated action taken by the agent. Stay informed instantly." },
            { icon: Lock, color: "#6366f1", bg: "rgba(99,102,241,0.1)", title: "Secure Auth", desc: "NextAuth with bcrypt-hashed passwords. Your goals, tasks, and agent runs are always secure." },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: bg, border: `1px solid ${color}30` }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-32 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">
            Up and running in{" "}
            <span style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              3 steps
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-20">Create an account, make a project, and let the AI plan it for you.</p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { step: "01", title: "Create your account", desc: "Sign up in seconds. Your personal workspace is provisioned automatically — no configuration needed.", icon: Users },
              { step: "02", title: "Type your goal", desc: "Use the AI Planner bar in the dashboard. Type any goal and hit Plan. The agent takes it from there.", icon: Brain },
              { step: "03", title: "Watch it execute", desc: "The LLM reasons, plans, and calls the createTask tool — populating your Kanban board automatically.", icon: Zap },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative p-8 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-6xl font-black mb-6 leading-none"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.5), transparent)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {step}
                </div>
                <Icon className="w-6 h-6 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECH STACK ──────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-10">Technology Stack</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {["Next.js 14", "Prisma + SQLite", "Groq (Qwen LLM)", "Vercel AI SDK", "NextAuth", "TypeScript"].map(name => (
              <span key={name} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "5+", label: "Agent reasoning steps" },
            { number: "< 3s", label: "Task generation time" },
            { number: "100%", label: "Problem requirements met" },
            { number: "∞", label: "Goals you can automate" },
          ].map(({ number, label }) => (
            <div key={label} className="space-y-2">
              <div className="text-4xl font-black"
                style={{ background: "linear-gradient(135deg, #fff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {number}
              </div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden p-16"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(79,70,229,0.35) 100%)", border: "1px solid rgba(124,58,237,0.5)" }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 50%, #4f46e5 0%, transparent 50%)" }} />
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6">
                Ready to automate your goals?
              </h2>
              <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
                Type any goal and let the AI Agent plan, reason, and execute the entire breakdown for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register"
                  className="flex items-center justify-center gap-2 text-base font-semibold px-10 py-4 rounded-full bg-white text-[#080808] transition-all duration-200 hover:bg-gray-100 hover:scale-105">
                  Get started — it&apos;s free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/login"
                  className="flex items-center justify-center gap-2 text-base font-semibold px-10 py-4 rounded-full transition-all duration-200 hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="py-12 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-lg">Task Pilot</span>
            <span className="text-xs text-purple-400 font-semibold">AI Agent</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
            <a href="#agent" className="hover:text-gray-300 transition-colors">The Agent</a>
            <a href="#how-it-works" className="hover:text-gray-300 transition-colors">How it works</a>
            <Link href="/login" className="hover:text-gray-300 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-gray-300 transition-colors">Sign Up</Link>
          </div>
          <p className="text-sm text-gray-600">© 2026 Task Pilot · AI Agentic System · Hackathon Submission</p>
        </div>
      </footer>
    </div>
  );
}
