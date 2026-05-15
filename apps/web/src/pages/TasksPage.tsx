import { Link } from "react-router-dom";

export function TasksPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>My Tasks</h1>
        <p className="muted" style={{ margin: 0 }}>Manage your tasks across all projects.</p>
      </div>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", display: "inline-flex", padding: 24, borderRadius: "50%", marginBottom: 8, color: "#3b82f6" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: 20, margin: "0" }}>Tasks View Upcoming</h3>
          <p className="muted" style={{ maxWidth: 400, textAlign: "center", margin: "0 0 16px" }}>A comprehensive cross-project task view is under construction. For now, please manage tasks within their respective projects.</p>
          <Link to="/projects" className="btn btn-primary">Go to Projects</Link>
        </div>
      </div>
    </div>
  );
}
