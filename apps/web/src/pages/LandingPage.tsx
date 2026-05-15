import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary)', marginRight: 8}}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Team Task Manager
        </div>
        <div className="landing-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <Link to="/login" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Manage Tasks.<br />
            Collaborate Better.<br />
            <span style={{ color: 'var(--primary)' }}>Deliver Results.</span>
          </h1>
          <p className="hero-subtitle">
            Team Task Manager helps teams organize projects, assign tasks, track progress, and get things done efficiently.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-large">Get Started</Link>
            <Link to="/login" className="btn btn-ghost btn-large" style={{border: '1px solid var(--border)'}}>Login</Link>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon" style={{background: '#eff6ff', color: '#3b82f6'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3>Team Collaboration</h3>
                <p>Work together seamlessly with your team</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{background: '#f0fdf4', color: '#22c55e'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div>
                <h3>Task Management</h3>
                <p>Create, assign and track tasks in one place</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{background: '#fefce8', color: '#eab308'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <div>
                <h3>Track Progress</h3>
                <p>Monitor progress and meet deadlines</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{background: '#faf5ff', color: '#a855f7'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <h3>Secure & Reliable</h3>
                <p>Your data is safe and secure with us</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <img src="/assets/dashboard.png" alt="Dashboard Preview" className="hero-image" />
        </div>
      </main>
    </div>
  );
}
