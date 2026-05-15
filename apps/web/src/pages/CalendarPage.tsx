export function CalendarPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Calendar</h1>
        <p className="muted" style={{ margin: 0 }}>View your tasks and deadlines in a calendar view.</p>
      </div>
      <div className="card" style={{ padding: "60px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", display: "inline-flex", padding: 24, borderRadius: "50%", marginBottom: 16, color: "#3b82f6" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <h3 style={{ fontSize: 20, margin: "0 0 8px" }}>Calendar Coming Soon</h3>
        <p className="muted" style={{ maxWidth: 400, margin: "0 auto" }}>We are working on bringing you a fully integrated calendar experience to manage all your deadlines.</p>
      </div>
    </div>
  );
}
