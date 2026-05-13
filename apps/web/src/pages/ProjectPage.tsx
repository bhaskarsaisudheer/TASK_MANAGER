import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../lib/api";
import { useAuth } from "../state/auth";

type Member = { role: "ADMIN" | "MEMBER"; joinedAt: string; user: { id: string; name: string; email: string } };
type Project = { id: string; name: string; inviteCode: string; createdAt: string; ownerId: string; members: Member[] };

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string; email: string };
  assignee: { id: string; name: string; email: string } | null;
};

export function ProjectPage() {
  const { projectId } = useParams();
  const api = useApi();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("");

  const myRole = useMemo(() => {
    if (!project || !user) return null;
    return project.members.find((m) => m.user.id === user.id)?.role ?? null;
  }, [project, user]);

  async function load() {
    if (!projectId) return;
    const [p, t] = await Promise.all([
      api.get<{ project: Project }>(`/api/projects/${projectId}`),
      api.get<{ tasks: Task[] }>(`/api/projects/${projectId}/tasks`),
    ]);
    setProject(p.project);
    setTasks(t.tasks);
  }

  useEffect(() => {
    load().catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load project"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (!projectId) return null;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: "0 0 6px", fontSize: 28 }}>{project?.name ?? "Project"}</h1>
            <div className="muted">
              Invite code: <span className="pill">{project?.inviteCode ?? "..."}</span>{" "}
              {myRole ? <span className="pill">Role: {myRole}</span> : null}
            </div>
          </div>
          <Link className="btn btn-ghost" to="/projects" style={{ alignSelf: "start", textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
      </div>

      {error ? <div className="error">{error}</div> : null}

      <div className="row">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Create task</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              try {
                await api.post(`/api/projects/${projectId}/tasks`, {
                  title,
                  description: description || undefined,
                  dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                  assigneeId: assigneeId || undefined,
                });
                setTitle("");
                setDescription("");
                setDueDate("");
                setAssigneeId("");
                await load();
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to create task");
              }
            }}
          >
            <div className="field">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="field">
              <label>Due date</label>
              <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" />
            </div>
            <div className="field">
              <label>Assign to</label>
              <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                <option value="">Unassigned</option>
                {project?.members.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.name} ({m.role})
                  </option>
                ))}
              </select>
              <div className="muted">
                Admin can assign to anyone; members can only assign to themselves.
              </div>
            </div>
            <button className="btn" type="submit">
              Create task
            </button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Team</h2>
          {project?.members?.length ? (
            <div style={{ display: "grid", gap: 8 }}>
              {project.members.map((m) => (
                <div key={m.user.id} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 650 }}>{m.user.name}</div>
                    <div className="muted">{m.user.email}</div>
                  </div>
                  <span className="pill">{m.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Loading members…</p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Tasks</h2>
        {tasks.length === 0 ? (
          <p className="muted">No tasks yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {tasks.map((t) => (
              <div
                key={t.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 12,
                  background: "var(--bg)",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 700 }}>{t.title}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="pill">{t.status}</span>
                    {t.dueDate ? (
                      <span className="pill">Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                    ) : null}
                  </div>
                </div>
                {t.description ? <div className="muted">{t.description}</div> : null}
                <div className="muted">
                  Created by {t.createdBy.name} • Assigned to {t.assignee ? t.assignee.name : "—"}
                </div>
                <div className="row" style={{ marginTop: 4 }}>
                  <div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label>Status</label>
                      <select
                        value={t.status}
                        onChange={async (e) => {
                          setError(null);
                          const status = e.target.value as Task["status"];
                          try {
                            await api.patch(`/api/projects/${projectId}/tasks/${t.id}`, { status });
                            setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)));
                          } catch (err: unknown) {
                            setError(err instanceof Error ? err.message : "Failed to update status");
                          }
                        }}
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label>Assignee</label>
                      <select
                        value={t.assignee?.id ?? ""}
                        onChange={async (e) => {
                          setError(null);
                          const next = e.target.value || null;
                          try {
                            await api.patch(`/api/projects/${projectId}/tasks/${t.id}`, { assigneeId: next });
                            await load();
                          } catch (err: unknown) {
                            setError(err instanceof Error ? err.message : "Failed to update assignee");
                          }
                        }}
                      >
                        <option value="">Unassigned</option>
                        {project?.members.map((m) => (
                          <option key={m.user.id} value={m.user.id}>
                            {m.user.name} ({m.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

