import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../lib/api";

type DashTask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null;
  project: { id: string; name: string };
};

export function DashboardPage() {
  const api = useApi();
  const [assigned, setAssigned] = useState<DashTask[]>([]);
  const [overdue, setOverdue] = useState<DashTask[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ assigned: DashTask[]; overdue: DashTask[]; counts: Record<string, number> }>("/api/dashboard")
      .then((d) => {
        setAssigned(d.assigned);
        setOverdue(d.overdue);
        setCounts(d.counts);
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="row">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>My task counts</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span className="pill">TODO: {counts.TODO ?? 0}</span>
            <span className="pill">IN_PROGRESS: {counts.IN_PROGRESS ?? 0}</span>
            <span className="pill">DONE: {counts.DONE ?? 0}</span>
          </div>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Quick links</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn" to="/projects" style={{ textDecoration: "none" }}>
              Projects
            </Link>
          </div>
        </div>
      </div>

      {error ? <div className="error">{error}</div> : null}

      <div className="row">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Overdue</h2>
          {overdue.length === 0 ? (
            <p className="muted">No overdue tasks.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {overdue.map((t) => (
                <Link
                  key={t.id}
                  to={`/projects/${t.project.id}`}
                  style={{ textDecoration: "none", color: "var(--text-h)" }}
                >
                  <div style={{ padding: 10, borderRadius: 12, border: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 650 }}>{t.title}</div>
                    <div className="muted">
                      {t.project.name} • Due {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Assigned to me</h2>
          {assigned.length === 0 ? (
            <p className="muted">No assigned tasks yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {assigned.slice(0, 12).map((t) => (
                <Link
                  key={t.id}
                  to={`/projects/${t.project.id}`}
                  style={{ textDecoration: "none", color: "var(--text-h)" }}
                >
                  <div style={{ padding: 10, borderRadius: 12, border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontWeight: 650 }}>{t.title}</div>
                      <span className="pill">{t.status}</span>
                    </div>
                    <div className="muted">{t.project.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

