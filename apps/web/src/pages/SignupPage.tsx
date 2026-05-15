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
  const [confirmPassword, setConfirmPassword] = useState("");
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
            <h2>Create Your Account</h2>
            <p>Sign up to get started with Team Task Manager.</p>
          </div>
          <img src="/assets/signup.png" alt="Signup Illustration" className="auth-illustration" />
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <h1>Sign Up</h1>
            <p className="muted" style={{ marginBottom: 32 }}>
              Create a new account to get started
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                if (password !== confirmPassword) {
                  setError("Passwords do not match");
                  return;
                }
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
                <label>Full Name</label>
                <input placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="field">
                <label>Email</label>
                <input placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  minLength={8}
                  required
                />
              </div>
              <div className="field">
                <label>Confirm Password</label>
                <input
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  minLength={8}
                  required
                />
              </div>
              {error ? <div className="error" style={{ marginBottom: 16 }}>{error}</div> : null}
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", padding: "12px", marginTop: "16px", fontSize: "15px" }}>
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            <p className="muted" style={{ marginTop: 24, textAlign: "center" }}>
              Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

