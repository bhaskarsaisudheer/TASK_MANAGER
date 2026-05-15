import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../lib/api";
import { useAuth } from "../state/auth";

type DashTask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  project: { id: string; name: string };
};

export function DashboardPage() {
  const api = useApi();
  const { user } = useAuth();
  const [assigned, setAssigned] = useState<DashTask[]>([]);
  const [overdue, setOverdue] = useState<DashTask[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [perUser, setPerUser] = useState<Record<string, number>>({});
  const [totalTasks, setTotalTasks] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ assigned: DashTask[]; overdue: DashTask[]; counts: Record<string, number>; perUser: Record<string, number>; totalTasks: number }>("/api/dashboard")
      .then((d) => {
        setAssigned(d.assigned);
        setOverdue(d.overdue);
        setCounts(d.counts);
        setPerUser(d.perUser);
        setTotalTasks(d.totalTasks);
      })
      .catch((e) => setError(e.message));
  }, []);

  const todo = counts.TODO ?? 0;
  const inProgress = counts.IN_PROGRESS ?? 0;
  const done = counts.DONE ?? 0;
  const overdueCount = overdue.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="muted" style={{ margin: 0 }}>
          Here's what's happening with your projects today.
        </p>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Metric Cards Row */}
      <div className="metrics-grid">
        <div className="card metric-card">
          <div className="metric-icon" style={{background: '#eff6ff', color: '#3b82f6'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
          <div className="metric-info">
            <div className="metric-label">Total Tasks</div>
            <div className="metric-value">{totalTasks}</div>
            <div className="metric-desc">All tasks across projects</div>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon" style={{background: '#f3e8ff', color: '#a855f7'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></div>
          <div className="metric-info">
            <div className="metric-label">To Do</div>
            <div className="metric-value">{todo}</div>
            <div className="metric-desc">Tasks to start</div>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon" style={{background: '#fefce8', color: '#eab308'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
          <div className="metric-info">
            <div className="metric-label">In Progress</div>
            <div className="metric-value">{inProgress}</div>
            <div className="metric-desc">Tasks in progress</div>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon" style={{background: '#f0fdf4', color: '#22c55e'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <div className="metric-info">
            <div className="metric-label">Done</div>
            <div className="metric-value">{done}</div>
            <div className="metric-desc">Completed tasks</div>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon" style={{background: '#fef2f2', color: '#ef4444'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
          <div className="metric-info">
            <div className="metric-label">Overdue</div>
            <div className="metric-value">{overdueCount}</div>
            <div className="metric-desc">Tasks overdue</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="card">
          <h3 style={{ margin: "0 0 24px", fontSize: 16 }}>Tasks by Status</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div className="donut-chart-placeholder">
              <div className="donut-inner">
                <span style={{ fontSize: 24, fontWeight: 700 }}>{totalTasks}</span>
                <span className="muted" style={{ fontSize: 12 }}>Total</span>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="status-legend"><span className="dot" style={{background: '#3b82f6'}}></span> <span>To Do</span> <span style={{marginLeft: 'auto', fontWeight: 600}}>{todo}</span></div>
              <div className="status-legend"><span className="dot" style={{background: '#eab308'}}></span> <span>In Progress</span> <span style={{marginLeft: 'auto', fontWeight: 600}}>{inProgress}</span></div>
              <div className="status-legend"><span className="dot" style={{background: '#22c55e'}}></span> <span>Done</span> <span style={{marginLeft: 'auto', fontWeight: 600}}>{done}</span></div>
              <div className="status-legend"><span className="dot" style={{background: '#ef4444'}}></span> <span>Overdue</span> <span style={{marginLeft: 'auto', fontWeight: 600}}>{overdueCount}</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Tasks Per User</h3>
            <select className="muted" style={{ border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", background: "transparent" }}>
              <option>This Month</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(perUser).length === 0 ? (
              <p className="muted">No tasks assigned.</p>
            ) : (
              Object.entries(perUser).map(([name, count], i) => {
                const max = Math.max(...Object.values(perUser));
                const width = `${(count / max) * 100}%`;
                const colors = ['#4f46e5', '#3b82f6', '#22c55e', '#eab308', '#ec4899'];
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 120, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name} {name === user?.name ? "(You)" : ""}</div>
                    <div style={{ flex: 1, height: 8, background: "var(--bg-secondary)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width, height: "100%", background: colors[i % colors.length], borderRadius: 4 }}></div>
                    </div>
                    <div style={{ width: 20, fontSize: 13, fontWeight: 600, textAlign: "right" }}>{count}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Lists Row */}
      <div className="lists-grid">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Overdue Tasks</h3>
            <Link to="/projects" className="btn btn-ghost" style={{ padding: "4px 12px", fontSize: 12 }}>View all</Link>
          </div>
          {overdue.length === 0 ? (
            <p className="muted">No overdue tasks.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {overdue.slice(0, 5).map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", marginTop: 6, flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{t.project.name}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 500, flexShrink: 0 }}>
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Upcoming Tasks</h3>
            <Link to="/projects" className="btn btn-ghost" style={{ padding: "4px 12px", fontSize: 12 }}>View all</Link>
          </div>
          {assigned.length === 0 ? (
            <p className="muted">No assigned tasks.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {assigned.slice(0, 5).map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", border: "2px solid #3b82f6", marginTop: 6, flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{t.project.name}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500, flexShrink: 0 }}>
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

