import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { ProjectRole } from "@prisma/client";
import { requireProjectRole } from "../middleware/requireProjectRole";

export const projectsRouter = Router();

projectsRouter.get("/", async (req, res) => {
  const userId = req.auth!.userId;

  const projects = await prisma.project.findMany({
    where: { members: { some: { userId } } },
    select: {
      id: true,
      name: true,
      inviteCode: true,
      createdAt: true,
      ownerId: true,
      members: { select: { userId: true, role: true } },
      tasks: { select: { status: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ projects });
});

projectsRouter.post("/", async (req, res) => {
  const userId = req.auth!.userId;
  const body = z.object({ name: z.string().min(1) }).parse(req.body);

  const project = await prisma.project.create({
    data: {
      name: body.name,
      ownerId: userId,
      members: { create: { userId, role: ProjectRole.ADMIN } },
    },
    select: { id: true, name: true, inviteCode: true, createdAt: true, ownerId: true },
  });

  return res.status(201).json({ project });
});

projectsRouter.post("/join", async (req, res) => {
  const userId = req.auth!.userId;
  const body = z.object({ inviteCode: z.string().min(1) }).parse(req.body);

  const project = await prisma.project.findUnique({ where: { inviteCode: body.inviteCode } });
  if (!project) return res.status(404).json({ error: "Invalid invite code" });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId } },
    create: { projectId: project.id, userId, role: ProjectRole.MEMBER },
    update: {},
  });

  return res.json({ projectId: project.id });
});

projectsRouter.get("/:projectId", requireProjectRole([ProjectRole.ADMIN, ProjectRole.MEMBER]), async (req, res) => {
  const projectId = req.params.projectId as string;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      inviteCode: true,
      createdAt: true,
      ownerId: true,
      members: {
        select: {
          role: true,
          joinedAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!project) return res.status(404).json({ error: "Project not found" });
  return res.json({ project });
});

projectsRouter.post(
  "/:projectId/invite/regenerate",
  requireProjectRole([ProjectRole.ADMIN]),
  async (req, res) => {
    const projectId = req.params.projectId as string;
    const newCode = `${projectId}_${Date.now().toString(36)}`;
    const final = await prisma.project.update({
      where: { id: projectId },
      data: { inviteCode: newCode },
      select: { inviteCode: true },
    });
    return res.json({ inviteCode: final.inviteCode });
  }
);

projectsRouter.delete(
  "/:projectId/members/:memberId",
  requireProjectRole([ProjectRole.ADMIN]),
  async (req, res) => {
    const projectId = req.params.projectId as string;
    const memberId = req.params.memberId as string;
    const userId = req.auth!.userId;

    if (memberId === userId) {
      return res.status(400).json({ error: "Cannot remove yourself from the project via this endpoint" });
    }

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId: memberId } },
    }).catch(() => null);

    return res.json({ success: true });
  }
);

