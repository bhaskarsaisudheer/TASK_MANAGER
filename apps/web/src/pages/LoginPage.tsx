import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { type User, useAuth } from "../state/auth";

export function LoginPage() {
  const nav = useNavigate();
  const { setToken, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="row">
      <div className="card">
        <h1 style={{ margin: "0 0 8px" }}>Welcome back</h1>
        <p className="muted" style={{ marginBottom: 18 }}>
          Login to manage projects and tasks.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const data = await apiFetch<{ token: string; user: User }>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
              });
              setToken(data.token);
              setUser(data.user);
              nav("/projects");
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : "Login failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          {error ? <div className="error" style={{ marginBottom: 10 }}>{error}</div> : null}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 14 }}>
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>What you can do</h2>
        <ul style={{ margin: 0, paddingLeft: 18, textAlign: "left" }}>
          <li>Create or join projects</li>
          <li>Assign tasks and track status</li>
          <li>See overdue tasks in your dashboard</li>
        </ul>
      </div>
    </div>
  );
}

