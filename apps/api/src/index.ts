import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { z } from "zod";
import { env } from "./env";
import { authenticate } from "./middleware/authenticate";
import { authRouter } from "./routes/auth";
import { projectsRouter } from "./routes/projects";
import { tasksRouter } from "./routes/tasks";
import { dashboardRouter } from "./routes/dashboard";
import { prisma } from "./prisma";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.APP_ORIGIN ? [env.APP_ORIGIN] : true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  return res.json({ ok: true });
});

app.use("/api/auth", authRouter);

app.get("/api/auth/me", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return res.json({ user });
});

app.use("/api/projects", authenticate, projectsRouter);

app.use(
  "/api/projects/:projectId/tasks",
  authenticate,
  tasksRouter
);

app.use("/api/dashboard", authenticate, dashboardRouter);

const webDist = path.resolve(__dirname, "../../web/dist");

app.use(express.static(webDist));

app.get("/*path", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      error: "Not found",
    });
  }

  return res.sendFile(path.join(webDist, "index.html"));
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: err.flatten(),
      });
    }

    console.error(err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});