import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { getTeamMembers } from "@/app/actions/team";
import { TeamTable } from "./team-table";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!hasPermission(session.user.role, "view:analytics")) {
    // If they aren't admin/manager, redirect back to dashboard
    redirect("/");
  }

  const members = await getTeamMembers();

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#080808", color: "white" }}>
      <header className="px-6 py-4 flex justify-between items-center" style={{ background: "#111111", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div>
          <h1 className="text-xl font-bold text-white">Team Management</h1>
          <p className="text-sm text-gray-500">Manage your workspace members and roles.</p>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-8">
        <TeamTable initialMembers={members} currentUser={session.user} />
      </main>
    </div>
  );
}
