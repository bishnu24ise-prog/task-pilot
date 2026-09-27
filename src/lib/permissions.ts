export type Role = "Admin" | "Manager" | "Member";

export const ROLES: Record<string, Role> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEMBER: "Member",
};

type Action =
  | "create:project"
  | "edit:project"
  | "delete:project"
  | "invite:user"
  | "remove:user"
  | "assign:role"
  | "view:activity_logs"
  | "view:analytics"
  | "create:task"
  | "update:task_status"
  | "update:task_assignee"
  | "delete:task"
  | "create:comment"
  | "delete:comment";

// Define what each role can do within a workspace/project
const rolePermissions: Record<Role, Action[]> = {
  Admin: [
    "create:project",
    "edit:project",
    "delete:project",
    "invite:user",
    "remove:user",
    "assign:role",
    "view:activity_logs",
    "view:analytics",
    "create:task",
    "update:task_status",
    "update:task_assignee",
    "delete:task",
    "create:comment",
    "delete:comment",
  ],
  Manager: [
    "create:project",
    "edit:project",
    "delete:project",
    "view:analytics",
    "create:task",
    "update:task_status",
    "update:task_assignee",
    "create:comment",
  ],
  Member: [
    "update:task_status",
    "create:comment",
  ],
};

/**
 * Checks if a user has permission to perform an action based on their role.
 * In a real-world scenario, you might also check if the user is the owner of a specific resource (e.g., they can only edit their own comments).
 */
export function hasPermission(userRole: string | undefined | null, action: Action): boolean {
  if (!userRole) return false;
  
  // Cast to Role type, defaulting to Member if not found
  const role = (Object.values(ROLES).includes(userRole as Role) ? userRole : ROLES.MEMBER) as Role;

  const permissions = rolePermissions[role];
  return permissions.includes(action);
}

/**
 * Helper to get all permissions for a specific role
 */
export function getPermissionsForRole(role: Role): Action[] {
  return rolePermissions[role] || [];
}
