import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../lib/api";

type Project = {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: string;
  ownerId: string;
  members: { userId: string; role: "ADMIN" | "MEMBER" }[];
  tasks?: { status: "TODO" | "IN_PROGRESS" | "DONE" }[];
};

export function ProjectsPage() {
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "MY" | "JOINED">("ALL");

  async function load() {
    const data = await api.get<{ projects: Project[] }>("/api/projects");
    setProjects(data.projects);
  }

  useEffect(() => {
    load().catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load projects"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    const name = window.prompt("Enter new project name:");
    if (!name) return;
    try {
      await api.post("/api/projects", { name });
      load();
    } catch (err: any) {
      alert(err.message || "Failed to create project");
    }
  };

  const handleJoin = async () => {
    const inviteCode = window.prompt("Enter project invite code:");
    if (!inviteCode) return;
    try {
      await api.post("/api/projects/join", { inviteCode });
      load();
    } catch (err: any) {
      alert(err.message || "Failed to join project");
    }
  };

  const icons = [
    { bg: '#eff6ff', color: '#3b82f6', svg: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path> },
    { bg: '#fff7ed', color: '#f97316', svg: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path> },
    { bg: '#f0fdf4', color: '#22c55e', svg: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></> },
    { bg: '#f3e8ff', color: '#a855f7', svg: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path> }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {error && <div className="error" style={{marginBottom: 24}}>{error}</div>}

      <div className="projects-header">
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === "ALL" ? "active" : ""}`} onClick={() => setFilter("ALL")}>All Projects</button>
          <button className={`filter-tab ${filter === "MY" ? "active" : ""}`} onClick={() => setFilter("MY")}>My Projects</button>
          <button className={`filter-tab ${filter === "JOINED" ? "active" : ""}`} onClick={() => setFilter("JOINED")}>Joined Projects</button>
        </div>
        <button className="btn btn-ghost" style={{ border: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
          Filter <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((p, i) => {
          const icon = icons[i % icons.length];
          const taskCount = p.tasks?.length || 0;
          const doneCount = p.tasks?.filter(t => t.status === 'DONE').length || 0;
          const progress = taskCount === 0 ? 0 : Math.round((doneCount / taskCount) * 100);

          return (
            <Link key={p.id} to={`/projects/${p.id}`} className="project-card">
              <div className="project-card-header">
                <div className="project-icon" style={{ background: icon.bg, color: icon.color }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon.svg}</svg>
                </div>
                <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={(e) => e.preventDefault()}>⋮</button>
              </div>
              <div className="project-title">{p.name}</div>
              <div className="project-desc">
                {p.name.includes("Clone") ? "E-commerce website clone project" : 
                 p.name.includes("Mobile") ? "Task management mobile application" :
                 p.name.includes("DevOps") ? "CI/CD pipeline and deployment" :
                 "Collaborative team project"}
              </div>
              <div className="project-footer">
                <div className="project-stats">
                  <span>{p.members.length} Members</span>
                  <span>{taskCount} Tasks</span>
                </div>
                <div className="project-progress">{progress}%</div>
              </div>
            </Link>
          );
        })}

        <div className="project-card dashed" onClick={handleCreate}>
          <svg className="plus-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 18 }}>Create New Project</div>
          <div className="muted" style={{ fontSize: 14 }}>Start a new project and invite your team</div>
        </div>

        <div className="project-card dashed" onClick={handleJoin}>
          <svg className="plus-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-2.2 0-4 1.8-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 18 }}>Join Project</div>
          <div className="muted" style={{ fontSize: 14 }}>Join an existing project with an invite code</div>
        </div>
      </div>
    </div>
  );
}

