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
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string; email: string };
  assignee: { id: string; name: string; email: string } | null;
};

// Task Card Component with Edit Toggle
function TaskCard({
  t,
  projectId,
  project,
  myRole,
  user,
  api,
  load,
  setError,
}: {
  t: Task;
  projectId: string;
  project: Project | null;
  myRole: string | null;
  user: any;
  api: any;
  load: () => Promise<void>;
  setError: (err: string | null) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<Task["status"]>(t.status);
  const [priority, setPriority] = useState<Task["priority"]>(t.priority);
  const [assigneeId, setAssigneeId] = useState(t.assignee?.id ?? "");

  const saveChanges = async () => {
    setError(null);
    try {
      await api.patch(`/api/projects/${projectId}/tasks/${t.id}`, {
        status,
        priority,
        assigneeId: assigneeId || null,
      });
      await load();
      setIsEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 12,
        background: "var(--bg)",
        display: "grid",
        gap: 8,
      }}
    >
      {!isEditing ? (
        <div>
          <h4 style={{ margin: "0 0 4px", fontSize: 18 }}>{t.title}</h4>
          {t.description && <p className="muted" style={{ margin: "0 0 4px" }}>{t.description}</p>}
          <p className="muted" style={{ margin: "0 0 4px" }}>
            Created by {t.createdBy.name} • Assigned to {t.assignee ? t.assignee.name : "Unassigned"}
          </p>
          <p className="muted" style={{ margin: 0, fontWeight: 500 }}>
            Status: {t.status} | Priority: {t.priority}
          </p>
          {t.dueDate && (
            <p className="muted" style={{ margin: "4px 0 0 0" }}>
              Due: {new Date(t.dueDate).toLocaleDateString()}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
            {(myRole === "ADMIN" || t.createdBy.id === user?.id || t.assignee?.id === user?.id) && (
              <button className="btn" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}
            {(myRole === "ADMIN" || t.createdBy.id === user?.id) && (
              <button
                className="btn"
                style={{ padding: "4px 10px", fontSize: 13, background: "var(--error)" }}
                onClick={async () => {
                  if (!confirm("Delete this task?")) return;
                  try {
                    await api.delete(`/api/projects/${projectId}/tasks/${t.id}`);
                    await load();
                  } catch (err: unknown) {
                    setError(err instanceof Error ? err.message : "Failed to delete task");
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <h4 style={{ margin: "0 0 4px", fontSize: 18 }}>Editing: {t.title}</h4>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Task["status"])}>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Assign to</label>
            <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
              <option value="">Unassigned</option>
              {project?.members
                .filter((m) => myRole === "ADMIN" || m.user.id === user?.id)
                .map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.name} ({m.role})
                  </option>
                ))}
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
            <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="btn" style={{ padding: "4px 10px", fontSize: 13 }} onClick={saveChanges}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [status, setStatus] = useState<Task["status"]>("TODO");
  const [priority, setPriority] = useState<Task["priority"]>("MEDIUM");

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

  const metrics = useMemo(() => {
    const total = tasks.length;
    const byStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    const perUser: Record<string, number> = {};
    let overdue = 0;
    const now = new Date();

    for (const t of tasks) {
      byStatus[t.status]++;
      if (t.assignee) {
        perUser[t.assignee.name] = (perUser[t.assignee.name] || 0) + 1;
      } else {
        perUser["Unassigned"] = (perUser["Unassigned"] || 0) + 1;
      }
      if (t.dueDate && new Date(t.dueDate) < now && t.status !== "DONE") {
        overdue++;
      }
    }
    return { total, byStatus, perUser, overdue };
  }, [tasks]);

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

      <div className="card" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
        <h2 style={{ marginTop: 0 }}>Dashboard Metrics</h2>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div>
            <strong>Total Tasks:</strong> {metrics.total}
          </div>
          <div>
            <strong>Overdue:</strong> <span style={{ color: "red" }}>{metrics.overdue}</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <strong>By Status:</strong>
            <span className="pill">TODO: {metrics.byStatus.TODO}</span>
            <span className="pill">IN_PROGRESS: {metrics.byStatus.IN_PROGRESS}</span>
            <span className="pill">DONE: {metrics.byStatus.DONE}</span>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <strong>Tasks per User:</strong>{" "}
          {Object.entries(metrics.perUser).length === 0 ? "No tasks yet" : Object.entries(metrics.perUser).map(([name, count]) => (
            <span key={name} className="pill" style={{ marginRight: 8 }}>
              {name}: {count}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
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
                  status,
                  priority,
                  dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                  assigneeId: assigneeId || undefined,
                });
                setTitle("");
                setDescription("");
                setDueDate("");
                setAssigneeId("");
                setStatus("TODO");
                setPriority("MEDIUM");
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
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Task["status"])}>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
            <div className="field">
              <label>Due date</label>
              <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" />
            </div>
            <div className="field">
              <label>Assign to</label>
              <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                <option value="">Unassigned</option>
                {project?.members
                  .filter((m) => myRole === "ADMIN" || m.user.id === user?.id)
                  .map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.name} ({m.role}) {m.user.id === user?.id ? "(You)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn" type="submit" style={{ marginTop: 8 }}>
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
                    <div style={{ fontWeight: 650 }}>{m.user.name} {m.user.id === user?.id ? "(You)" : ""}</div>
                    <div className="muted">{m.user.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="pill">{m.role}</span>
                    {myRole === "ADMIN" && m.user.id !== user?.id && (
                      <button
                        className="btn"
                        style={{ padding: "4px 8px", fontSize: 12, background: "var(--error)" }}
                        onClick={async () => {
                          if (!confirm("Remove this member?")) return;
                          try {
                            await api.delete(`/api/projects/${projectId}/members/${m.user.id}`);
                            await load();
                          } catch (err: unknown) {
                            setError(err instanceof Error ? err.message : "Failed to remove member");
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
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
              <TaskCard
                key={t.id}
                t={t}
                projectId={projectId}
                project={project}
                myRole={myRole}
                user={user}
                api={api}
                load={load}
                setError={setError}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

