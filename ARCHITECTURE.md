# Architecture Overview

This document outlines the design decisions for the Role-Based Access Control (RBAC) and real-time collaboration features of Detask.

## 1. Role-Based Access Control (RBAC)

RBAC in Detask is designed to be centralized and robust, preventing scattered `if/else` checks across the codebase.

### The `permissions.ts` Matrix
We define three core roles: **Admin**, **Manager**, and **Member**.
Instead of checking `user.role === 'Admin'`, we verify capabilities via a unified `hasPermission(userRole, action)` function.
This function checks against a strict permissions matrix that maps roles to allowable actions (e.g., `update:task_status`, `delete:project`).

### Multi-layer Enforcement
1. **UI Layer (Client/Server Components)**: Components conditionally render based on `hasPermission`. E.g., a Member will not see the "Delete Project" button.
2. **API/Server Actions Layer**: Every sensitive Server Action retrieves the session via `getServerSession` and validates the user's role against the required action using `hasPermission`. If unauthorized, it throws an error before hitting the database.

## 2. Real-time Collaboration

Real-time capabilities are critical for a task management tool.

### Choosing Pusher over Custom WebSockets
For a Next.js App Router application deployed on serverless infrastructure (like Vercel), maintaining long-lived WebSocket connections via a custom `Socket.io` server introduces significant deployment friction.
We opted for **Pusher**, a managed publish/subscribe service.

### Implementation Flow
1. **Server Action Mutation**: When a user moves a task (drag-and-drop), the client optimistic UI updates immediately, and a Server Action (`updateTaskStatus`) is called.
2. **Database Update**: The server updates Prisma.
3. **Pusher Trigger**: The server action triggers a Pusher event (`task-updated`) on the specific project channel.
4. **Client Subscription**: Other connected clients subscribed to the project channel receive the payload and update their local state, achieving seamless live synchronization.
