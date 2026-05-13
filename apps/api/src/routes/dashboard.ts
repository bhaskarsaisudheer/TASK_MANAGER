import { Router } from "express";
import { prisma } from "../prisma";
import { TaskStatus } from "@prisma/client";

export const dashboardRouter = Router();

dashboardRouter.get("/", async (req, res) => {
  const userId = req.auth!.userId;
  const now = new Date();

  const [assigned, overdue, byStatus] = await Promise.all([
    prisma.task.findMany({
      where: { assigneeId: userId },
      select: {
        id: true,
        title: true,
        status: true,
        dueDate: true,
        project: { select: { id: true, name: true } },
      },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
      take: 50,
    }),
    prisma.task.findMany({
      where: { assigneeId: userId, dueDate: { lt: now }, status: { not: TaskStatus.DONE } },
      select: {
        id: true,
        title: true,
        status: true,
        dueDate: true,
        project: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: "asc" },
      take: 50,
    }),
    prisma.task.groupBy({
      by: ["status"],
      where: { assigneeId: userId },
      _count: { _all: true },
    }),
  ]);

  return res.json({
    assigned,
    overdue,
    counts: Object.fromEntries(byStatus.map((r) => [r.status, r._count._all])),
  });
});

