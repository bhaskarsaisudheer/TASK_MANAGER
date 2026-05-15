import { Router } from "express";
import { prisma } from "../prisma";
import { TaskStatus } from "@prisma/client";

export const dashboardRouter = Router();

dashboardRouter.get("/", async (req, res) => {
  const userId = req.auth!.userId;
  const now = new Date();

  // Get all projects the user is a part of
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    select: { projectId: true },
  });
  const projectIds = memberships.map((m) => m.projectId);

  // Fetch all tasks for these projects
  const allTasks = await prisma.task.findMany({
    where: { projectId: { in: projectIds } },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      assigneeId: true,
      assignee: { select: { name: true } },
      project: { select: { id: true, name: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  const assigned = allTasks.filter((t) => t.assigneeId === userId).slice(0, 50);
  const overdue = allTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "DONE"
  );
  
  const counts = { TODO: 0, IN_PROGRESS: 0, DONE: 0 } as Record<string, number>;
  const perUser: Record<string, number> = {};
  
  for (const t of allTasks) {
    counts[t.status] = (counts[t.status] || 0) + 1;
    const name = t.assignee?.name || "Unassigned";
    perUser[name] = (perUser[name] || 0) + 1;
  }

  return res.json({
    totalTasks: allTasks.length,
    assigned,
    overdue,
    counts,
    perUser,
  });
});

