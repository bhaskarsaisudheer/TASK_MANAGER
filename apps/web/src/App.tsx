import { Navigate, Route, Routes, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./state/auth";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectPage } from "./pages/ProjectPage";
import { DashboardPage } from "./pages/DashboardPage";
import "./App.css";

function Protected({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const nav = useNavigate();
  const { token, user, logout } = useAuth();

  return (
    <div className="app">
      <header className="topbar">
        <Link className="brand" to={token ? "/projects" : "/"}>
          Team Task Manager
        </Link>
        <nav className="nav">
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/projects">Projects</Link>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  logout();
                  nav("/login");
                }}
              >
                Logout{user ? ` (${user.name})` : ""}
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link className="btn" to="/signup">
                Signup
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/projects" : "/login"} replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <DashboardPage />
              </Protected>
            }
          />
          <Route
            path="/projects"
            element={
              <Protected>
                <ProjectsPage />
              </Protected>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <Protected>
                <ProjectPage />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
