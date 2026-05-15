export function TeamPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Team Directory</h1>
          <p className="muted" style={{ margin: 0 }}>Manage your team members and their roles.</p>
        </div>
        <button className="btn btn-primary">+ Add Member</button>
      </div>
      
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
              <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Member</th>
              <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Role</th>
              <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Status</th>
              <th style={{ padding: "16px 24px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} style={{ padding: "60px 24px", textAlign: "center" }}>
                <div style={{ background: "linear-gradient(135deg, #f0fdf4, #bbf7d0)", display: "inline-flex", padding: 16, borderRadius: "50%", marginBottom: 12, color: "#22c55e" }}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3 style={{ margin: "0 0 4px" }}>No team members yet</h3>
                <p className="muted" style={{ margin: 0 }}>Start by adding a team member to collaborate.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
