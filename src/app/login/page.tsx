"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GitBranch, ArrowRight, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex bg-[#080808]">

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0f0720 0%, #0c0c1e 50%, #080818 100%)" }} />
        {/* Glows */}
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)" }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}>
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Task Pilot</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-10">
          <div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight mb-4">
              Welcome back to
              <br />
              <span style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                your workspace.
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              Sign in to access your Kanban boards, collaborate with your team, and keep shipping.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Real-time collaboration across your entire team",
              "Role-based permissions, enforced server-side",
              "Drag-and-drop Kanban with instant sync",
              "Full activity logs and audit trails",
            ].map(feat => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" }}>
                  <CheckCircle className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-gray-300 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-gray-300 text-sm italic leading-relaxed mb-4">
            &ldquo;Task Pilot completely transformed how our engineering team manages work. The real-time updates are a game changer.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>A</div>
            <div>
              <div className="text-white text-sm font-semibold">Alice Johnson</div>
              <div className="text-gray-500 text-xs">Engineering Lead, Acme Corp</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (FORM) ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Subtle background */}
        <div className="absolute inset-0"
          style={{ background: "#0d0d0d" }} />
        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.3), transparent)" }} />

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Task Pilot</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Sign in</h2>
            <p className="text-gray-400">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-400"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={e => { e.target.style.border = "1px solid rgba(124,58,237,0.6)"; e.target.style.background = "rgba(124,58,237,0.05)"; }}
                onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-white text-sm placeholder-gray-600 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(124,58,237,0.6)"; e.target.style.background = "rgba(124,58,237,0.05)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-gray-600 text-xs">OR</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Demo credentials */}
          <div className="p-4 rounded-xl mb-6"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <p className="text-xs font-semibold text-purple-400 mb-2">Demo credentials</p>
            <p className="text-xs text-gray-400"><span className="text-gray-300">Email:</span> admin@detask.com</p>
            <p className="text-xs text-gray-400"><span className="text-gray-300">Password:</span> password123</p>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
