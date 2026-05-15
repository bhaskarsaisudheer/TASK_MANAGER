export function ReportsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Reports & Analytics</h1>
          <p className="muted" style={{ margin: 0 }}>Get insights into your team's performance.</p>
        </div>
        <button className="btn btn-ghost" style={{ border: "1px solid var(--border)" }}>Export Data</button>
      </div>

      <div className="card" style={{ padding: "60px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ background: "linear-gradient(135deg, #f3e8ff, #d8b4fe)", display: "inline-flex", padding: 24, borderRadius: "50%", marginBottom: 16, color: "#a855f7" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        </div>
        <h3 style={{ fontSize: 20, margin: "0 0 8px" }}>Advanced Reports</h3>
        <p className="muted" style={{ maxWidth: 400 }}>Unlock detailed analytics and custom report generation in the upcoming release.</p>
      </div>
    </div>
  );
}
