import { useAuth } from "../state/auth";

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Settings</h1>
        <p className="muted" style={{ margin: 0 }}>Manage your account preferences and application settings.</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 18 }}>Profile Settings</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Full Name</label>
            <input type="text" value={user?.name || ""} readOnly className="form-input" style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)" }} disabled />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Email Address</label>
            <input type="email" value={user?.email || ""} readOnly className="form-input" style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)" }} disabled />
          </div>
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-primary" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>Save Changes</button>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ maxWidth: 600 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 18 }}>Application Settings</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 500 }}>Email Notifications</div>
              <div className="muted" style={{ fontSize: 13 }}>Receive email updates for tasks and projects</div>
            </div>
            <div style={{ width: 40, height: 20, background: "var(--bg-secondary)", borderRadius: 10, position: "relative", cursor: "pointer" }}>
              <div style={{ width: 16, height: 16, background: "var(--text-secondary)", borderRadius: "50%", position: "absolute", top: 2, left: 2 }}></div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 500 }}>Desktop Notifications</div>
              <div className="muted" style={{ fontSize: 13 }}>Show desktop alerts for mentions and due dates</div>
            </div>
            <div style={{ width: 40, height: 20, background: "var(--primary)", borderRadius: 10, position: "relative", cursor: "pointer" }}>
              <div style={{ width: 16, height: 16, background: "white", borderRadius: "50%", position: "absolute", top: 2, right: 2 }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
