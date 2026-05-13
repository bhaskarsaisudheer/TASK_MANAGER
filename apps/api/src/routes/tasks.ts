import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { ProjectRole, TaskStatus } from "@prisma/client";
import { requireProjectRole } from "../middleware/requireProjectRole";

export const tasksRouter = Router({ mergeParams: true });

tasksRouter.get(
  "/",
  requireProjectRole([ProjectRole.ADMIN, ProjectRole.MEMBER]),
  async (req, res) => {
    const projectId = req.params.projectId as string;

    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    });

    return res.json({ tasks });
  }
);

tasksRouter.post(
  "/",
  requireProjectRole([ProjectRole.ADMIN, ProjectRole.MEMBER]),
  async (req, res) => {
    const userId = req.auth!.userId;
    const projectId = req.params.projectId as string;

    const body = z
      .object({
        title: z.string().min(1),
        description: z.string().optional(),
        dueDate: z.string().datetime().optional(),
        assigneeId: z.string().cuid().optional(),
      })
      .parse(req.body);

    const role = (req as any).projectRole as ProjectRole | undefined;
    if (body.assigneeId && role !== ProjectRole.ADMIN && body.assigneeId !== userId) {
      return res.status(403).json({ error: "Only Admin can assign tasks to others" });
    }

    if (body.assigneeId) {
      const member = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: body.assigneeId } },
      });
      if (!member) return res.status(400).json({ error: "Assignee is not a project member" });
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title: body.title,
        description: body.description,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        createdById: userId,
        assigneeId: body.assigneeId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({ task });
  }
);

tasksRouter.patch(
  "/:taskId",
  requireProjectRole([ProjectRole.ADMIN, ProjectRole.MEMBER]),
  async (req, res) => {
    const userId = req.auth!.userId;
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;

    const body = z
      .object({
        title: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        dueDate: z.string().datetime().nullable().optional(),
        assigneeId: z.string().cuid().nullable().optional(),
      })
      .parse(req.body);

    const role = (req as any).projectRole as ProjectRole | undefined;
    if (body.assigneeId !== undefined) {
      const requested = body.assigneeId ?? null;
      if (requested && role !== ProjectRole.ADMIN && requested !== userId) {
        return res.status(403).json({ error: "Only Admin can assign tasks to others" });
      }
      if (requested) {
        const member = await prisma.projectMember.findUnique({
          where: { projectId_userId: { projectId, userId: requested } },
        });
        if (!member) return res.status(400).json({ error: "Assignee is not a project member" });
      }
    }

    const task = await prisma.task.findFirst({ where: { id: taskId, projectId } });
    if (!task) return res.status(404).json({ error: "Task not found" });

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title,
        description: body.description === undefined ? undefined : body.description,
        status: body.status,
        dueDate:
          body.dueDate === undefined ? undefined : body.dueDate === null ? null : new Date(body.dueDate),
        assigneeId: body.assigneeId === undefined ? undefined : body.assigneeId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({ task: updated });
  }
);

