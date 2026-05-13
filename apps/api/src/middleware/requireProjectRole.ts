import type { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { ProjectRole } from "@prisma/client";

export function requireProjectRole(allowed: ProjectRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.auth?.userId;
    const projectId = req.params.projectId as string | undefined;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!projectId) return res.status(400).json({ error: "Missing projectId" });

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });

    if (!member) return res.status(403).json({ error: "Not a project member" });
    if (!allowed.includes(member.role)) return res.status(403).json({ error: "Insufficient role" });

    (req as any).projectRole = member.role;
    return next();
  };
}

