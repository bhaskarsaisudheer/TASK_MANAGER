import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { type User, useAuth } from "../state/auth";

export function SignupPage() {
  const nav = useNavigate();
  const { setToken, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 8px" }}>Create your account</h1>
      <p className="muted" style={{ marginBottom: 18 }}>
        Signup to create and collaborate on projects.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);
          try {
            const data = await apiFetch<{ token: string; user: User }>("/api/auth/signup", {
              method: "POST",
              body: JSON.stringify({ name, email, password }),
            });
            setToken(data.token);
            setUser(data.user);
            nav("/projects");
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Signup failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="field">
          <label>Password (min 8 chars)</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            minLength={8}
            required
          />
        </div>
        {error ? <div className="error" style={{ marginBottom: 10 }}>{error}</div> : null}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>
      </form>

      <p className="muted" style={{ marginTop: 14 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

