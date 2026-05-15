import { Navigate, Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./state/auth";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectPage } from "./pages/ProjectPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { TasksPage } from "./pages/TasksPage";
import { CalendarPage } from "./pages/CalendarPage";
import { TeamPage } from "./pages/TeamPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { useState, useEffect } from "react";
import "./App.css";

function Protected({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const nav = useNavigate();
  const { token, user, logout } = useAuth();
  const location = useLocation();

  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isAuthOrLandingPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthOrLandingPage) {
    return (
      <div className="app">
        <main className="container-fluid">
          <Routes>
            <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/signup" element={token ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'white', marginRight: 8}}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Team Task Manager
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
          <Link to="/projects" className={location.pathname.startsWith('/projects') ? 'active' : ''}>Projects</Link>
          <Link to="/tasks" className={location.pathname.startsWith('/tasks') ? 'active' : ''}>Tasks</Link>
          <Link to="/calendar" className={location.pathname.startsWith('/calendar') ? 'active' : ''}>Calendar</Link>
          <Link to="/team" className={location.pathname.startsWith('/team') ? 'active' : ''}>Team</Link>
          <Link to="/reports" className={location.pathname.startsWith('/reports') ? 'active' : ''}>Reports</Link>
          <Link to="/settings" className={location.pathname.startsWith('/settings') ? 'active' : ''}>Settings</Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-profile" onClick={logout} style={{cursor: 'pointer'}} title="Click to logout">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">Admin</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </aside>

      <div className="main-content-wrapper">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            <h2 style={{ textTransform: 'capitalize' }}>
              {location.pathname.split('/')[1] || 'Dashboard'}
            </h2>
            <div className="topbar-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="muted"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search projects..." />
            </div>
          </div>
          <div className="topbar-right">
            <button className="theme-toggle" onClick={toggleTheme} style={{ fontSize: '20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
              {theme === "light" ? "☾" : "☀"}
            </button>
            <button className="btn btn-ghost" onClick={() => { logout(); nav("/login"); }} style={{ padding: '8px 16px', fontWeight: 600 }}>
              Logout
            </button>
            <div className="notification-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="badge">3</span>
            </div>
            <button className="btn btn-primary" onClick={() => nav('/projects')}>+ New Project</button>
          </div>
        </header>

        <main className="dashboard-main">
          <Routes>
            <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
            <Route path="/projects" element={<Protected><ProjectsPage /></Protected>} />
            <Route path="/projects/:projectId" element={<Protected><ProjectPage /></Protected>} />
            <Route path="/tasks" element={<Protected><TasksPage /></Protected>} />
            <Route path="/calendar" element={<Protected><CalendarPage /></Protected>} />
            <Route path="/team" element={<Protected><TeamPage /></Protected>} />
            <Route path="/reports" element={<Protected><ReportsPage /></Protected>} />
            <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
