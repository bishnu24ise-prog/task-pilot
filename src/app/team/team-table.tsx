"use client";

import { useState } from "react";
import { changeUserRole, removeUser, inviteUser } from "@/app/actions/team";
import { toast } from "@/components/ui/toast";
import { UserPlus, X, Loader2, Trash2, ChevronDown } from "lucide-react";

type Member = { id: string; name: string | null; email: string; role: string };

const ROLES = ["Admin", "Manager", "Member"];
const ROLE_STYLE: Record<string, { color: string; bg: string }> = {
  Admin:   { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  Manager: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  Member:  { color: "#9ca3af", bg: "rgba(156,163,175,0.10)" },
};

function RoleSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const style = ROLE_STYLE[value] || ROLE_STYLE.Member;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all hover:opacity-80"
        style={{ background: style.bg, color: style.color }}
      >
        {value}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 rounded-xl overflow-hidden"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", minWidth: "120px" }}>
            {ROLES.map(role => {
              const s = ROLE_STYLE[role];
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => { onChange(role); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left transition-colors hover:bg-white/5"
                  style={{ color: s.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  {role}
                  {role === value && <span className="ml-auto text-[10px] opacity-50">✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function TeamTable({ initialMembers, currentUser }: { initialMembers: Member[]; currentUser: { id: string; role: string } }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");

  const canManage = currentUser.role === "Admin";

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await changeUserRole(userId, newRole);
      setMembers(m => m.map(x => x.id === userId ? { ...x, role: newRole } : x));
      toast.add({ title: "Role updated" });
    } catch (error: unknown) {
      toast.add({ type: "error", title: "Error", description: error instanceof Error ? error.message : "Failed" });
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this user from the workspace?")) return;
    try {
      await removeUser(userId);
      setMembers(m => m.filter(x => x.id !== userId));
      toast.add({ title: "User removed" });
    } catch (error: unknown) {
      toast.add({ type: "error", title: "Error", description: error instanceof Error ? error.message : "Failed" });
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await inviteUser(inviteEmail, inviteName, inviteRole);
      setMembers(m => [newUser, ...m]);
      toast.add({ title: "User invited" });
      setInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
    } catch (error: unknown) {
      toast.add({ type: "error", title: "Error", description: error instanceof Error ? error.message : "Failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px",
    color: "#fff", outline: "none", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.15s",
  };

  return (
    <div className="space-y-6">
      {/* Invite button */}
      {canManage && (
        <div className="flex justify-end">
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Header */}
        <div className="grid px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gray-600"
          style={{ gridTemplateColumns: "1fr 1fr auto auto", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          {canManage && <span className="text-right pr-2">Actions</span>}
        </div>

        {/* Rows */}
        <div>
          {members.map((member, i) => {
            const style = ROLE_STYLE[member.role] || ROLE_STYLE.Member;
            const isMe = member.id === currentUser.id;
            return (
              <div
                key={member.id}
                className="grid items-center px-6 py-4 transition-colors hover:bg-white/[0.02]"
                style={{
                  gridTemplateColumns: "1fr 1fr auto auto",
                  borderBottom: i < members.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                {/* Name + avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: isMe ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "rgba(255,255,255,0.1)" }}>
                    {member.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {member.name}
                      {isMe && <span className="ml-2 text-[10px] text-gray-600">(you)</span>}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="text-sm text-gray-500 truncate pr-4">{member.email}</div>

                {/* Role */}
                <div className="min-w-[100px]">
                  {canManage && !isMe ? (
                    <RoleSelect value={member.role} onChange={val => handleRoleChange(member.id, val)} />
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: style.bg, color: style.color }}>
                      {member.role}
                    </span>
                  )}
                </div>

                {/* Remove */}
                {canManage && (
                  <div className="flex justify-end">
                    {!isMe && (
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="p-2 rounded-lg text-gray-700 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Remove user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {members.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-gray-700 text-sm">No members yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setInviteOpen(false); }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Invite Member</h2>
              <button onClick={() => setInviteOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Full name *</label>
                <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Jane Smith" required style={inputStyle}
                  onFocus={e => { e.target.style.border = "1px solid rgba(124,58,237,0.6)"; e.target.style.background = "rgba(124,58,237,0.05)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Email address *</label>
                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="jane@company.com" required style={inputStyle}
                  onFocus={e => { e.target.style.border = "1px solid rgba(124,58,237,0.6)"; e.target.style.background = "rgba(124,58,237,0.05)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Role</label>
                <div className="flex gap-2">
                  {ROLES.map(role => {
                    const s = ROLE_STYLE[role];
                    return (
                      <button key={role} type="button" onClick={() => setInviteRole(role)}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: inviteRole === role ? s.bg : "rgba(255,255,255,0.04)",
                          border: inviteRole === role ? `1px solid ${s.color}50` : "1px solid rgba(255,255,255,0.08)",
                          color: inviteRole === role ? s.color : "#6b7280",
                        }}>
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setInviteOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                  {isLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Inviting...</> : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
