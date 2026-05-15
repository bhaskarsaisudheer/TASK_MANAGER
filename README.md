# 🚀 Team Task Manager

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-darkblue)

A professional, full-stack team collaboration and task management web application. Designed to help teams organize projects, assign tasks, track progress, and deliver results efficiently in a sleek, modern interface.

---

## ✨ Key Features

- **🔐 Secure Authentication:** JWT-based user registration and login system.
- **📁 Project Management:** Create workspaces, generate invite codes, and securely add team members.
- **👥 Role-Based Access Control (RBAC):** `ADMIN` and `MEMBER` roles ensure strict permission control (e.g., only admins can remove members or assign tasks).
- **✅ Comprehensive Task Tracking:** Create, edit, assign, and track tasks by priority (LOW, MEDIUM, HIGH) and status (TODO, IN PROGRESS, DONE).
- **📊 Interactive Dashboard:** Visual metrics displaying total tasks, overdue tasks, status breakdowns, and user assignment workloads.
- **🧭 Comprehensive Navigation:** Dedicated sections for Projects, cross-project Tasks, Calendar views, Team directory, Analytics & Reports, and Account Settings.
- **🎨 Modern UI/UX:** Responsive, fully custom CSS styling with a beautiful split-pane layout for authentication and a sleek landing page. Light and Dark mode support out-of-the-box.

---

## 🛠 Tech Stack

This project is built using a monorepo structure with modern, scalable technologies.

### Frontend (`apps/web`)
- **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Routing:** React Router DOM
- **Styling:** Custom Vanilla CSS (Responsive, CSS Variables, Theme Toggling)
- **Language:** TypeScript

### Backend (`apps/api`)
- **Framework:** [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL / MySQL (Configurable via URL)
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (JWT) & bcrypt

---

## 📂 Project Structure

```text
TASK_MANAGER/
├── package.json          # Root workspace configuration
├── apps/
│   ├── api/              # Express backend server
│   │   ├── prisma/       # Database schema and migrations
│   │   ├── src/
│   │   │   ├── routes/   # API controllers (auth, projects, tasks)
│   │   │   └── index.ts  # Express app entry point
│   │   └── package.json
│   │
│   └── web/              # React frontend application
│       ├── public/       # Static assets (images, vectors)
│       ├── src/
│       │   ├── components/
│       │   ├── pages/    # React page views (Landing, Auth, Dashboard, etc.)
│       │   ├── lib/      # API wrappers
│       │   └── App.tsx   # Core routing
│       └── package.json
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A running relational database (MySQL or PostgreSQL)

### 2. Installation
Clone the repository and install the dependencies for both the frontend and backend simultaneously using npm workspaces:

```bash
npm install
```

### 3. Environment Variables
Create a `.env` file inside the `apps/api` directory:

```bash
# apps/api/.env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DB" # Or postgres://
JWT_SECRET="your_super_secret_jwt_key_here"
APP_ORIGIN="http://localhost:5173" # URL of your frontend
PORT=3000
```

### 4. Database Initialization
Push the Prisma schema to your database to create the necessary tables:

```bash
# Run from the root directory
npm run prisma:db-push -w api
# Or migrate for production: npm run prisma:migrate -w api
```

### 5. Running the Application
You can start the frontend and backend concurrently using two terminal windows.

**Start the Backend API:**
```bash
npm run dev:api
```
*(The API will start at http://localhost:3000)*

**Start the Frontend Web App:**
```bash
npm run dev:web
```
*(The web application will start at http://localhost:5173)*

---

## 🌐 API Endpoints Overview

- **Auth:** `POST /api/auth/signup`, `POST /api/auth/login`
- **Projects:** `GET /api/projects`, `POST /api/projects`, `GET /api/projects/:id`
- **Team:** `POST /api/projects/join`, `DELETE /api/projects/:projectId/members/:memberId`
- **Tasks:** `GET /api/projects/:projectId/tasks`, `POST /api/projects/:projectId/tasks`, `PATCH /api/projects/:projectId/tasks/:taskId`, `DELETE /api/projects/:projectId/tasks/:taskId`
- **Dashboard:** `GET /api/dashboard`

---

## ☁️ Deployment

For production deployment (e.g., Railway, Render, Heroku):
1. Provision a managed database (PostgreSQL/MySQL).
2. Set the `DATABASE_URL`, `JWT_SECRET`, and `APP_ORIGIN` environment variables in your deployment platform.
3. Build the frontend and backend using `npm run build`.
4. Run the production server via `npm start`.

---
*Built with ❤️ for productive teams.*