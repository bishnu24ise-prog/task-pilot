# Task Pilot - AI-Powered Task Management 🚀

Task Pilot is an intelligent, autonomous project management tool built for modern teams. It features a built-in AI Agent (powered by Groq & Qwen) that can take high-level goals and automatically break them down into structured, prioritized tasks on your Kanban board.

## 🌟 Hackathon Features (Problem Statement Matched)

1. **Reasoning & Planning**: The AI agent analyzes your input goals and uses deterministic reasoning (via Zod schemas) to break them down into actionable steps with assigned priority levels.
2. **Tool Use & Execution**: The agent automatically executes server actions to push the generated tasks directly into your live SQLite database.
3. **State & Context Maintenance**: A real-time Drag & Drop Kanban board ensures task states (To Do, In Progress, Done) are seamlessly maintained and instantly synced across the UI.
4. **Autonomous AI Scheduler**: Includes a cron-style Scheduler Panel that lets you schedule the AI to automatically run and generate tasks on a Daily, Weekly, or Monthly interval.

## 💻 Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons, DnD-Kit (for Drag & Drop)
- **Backend**: Next.js Server Actions & API Routes
- **Database**: Prisma ORM, SQLite
- **AI Integration**: Vercel AI SDK, Groq API (`qwen-2.5-32b`)
- **Authentication**: NextAuth.js (Credentials Provider)

## 🚀 Getting Started Locally

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-super-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   GROQ_API_KEY="your-groq-api-key"
   ```

3. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   *Login with the seeded admin account:*
   - **Email**: `admin@detask.com`
   - **Password**: `password123`

## 🌍 Deployment

To deploy this project easily while keeping the SQLite database, we recommend deploying to **Render.com** as a Web Service with a Persistent Disk mounted at `/opt/render/project/src/prisma`.

---
*Built with ❤️ for the AI Agent Hackathon.*
