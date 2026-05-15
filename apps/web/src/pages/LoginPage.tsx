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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left bg-blue">
          <div className="auth-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'white', marginRight: 8}}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Team Task Manager
          </div>
          <div className="auth-hero-text">
            <h2>Welcome Back!</h2>
            <p>Login to continue managing your tasks and projects.</p>
          </div>
          <img src="/assets/login.png" alt="Login Illustration" className="auth-illustration" />
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <h1>Login</h1>
            <p className="muted" style={{ marginBottom: 32 }}>
              Enter your credentials to access your account
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
                <input placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </div>
              <div className="field">
                <label>Password</label>
                <div className="password-input-wrapper" style={{display: 'flex', flexDirection: 'column'}}>
                  <input
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                  <div style={{textAlign: 'right', marginTop: '6px'}}>
                    <Link to="/forgot-password" style={{fontSize: '13px', color: 'var(--primary)', textDecoration: 'none'}}>Forgot password?</Link>
                  </div>
                </div>
              </div>
              {error ? <div className="error" style={{ marginBottom: 16 }}>{error}</div> : null}
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", padding: "12px", marginTop: "16px", fontSize: "15px" }}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="muted" style={{ marginTop: 24, textAlign: "center" }}>
              Don't have an account? <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

