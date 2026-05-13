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
};

export function ProjectsPage() {
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await api.get<{ projects: Project[] }>("/api/projects");
    setProjects(data.projects);
  }

  useEffect(() => {
    load().catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load projects"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="row">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Create project</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                await api.post("/api/projects", { name });
                setName("");
                await load();
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to create project");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="field">
              <label>Project name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Join project</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                await api.post("/api/projects/join", { inviteCode });
                setInviteCode("");
                await load();
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to join project");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="field">
              <label>Invite code</label>
              <input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required />
            </div>
            <button className="btn btn-ghost" type="submit" disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </button>
          </form>
        </div>
      </div>

      {error ? <div className="error">{error}</div> : null}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Your projects</h2>
        {projects.length === 0 ? (
          <p className="muted">No projects yet. Create one or join using an invite code.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                  color: "var(--text-h)",
                  background: "var(--bg)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 650 }}>{p.name}</div>
                  <div className="muted">Invite: {p.inviteCode}</div>
                </div>
                <span className="pill">{p.members.length} member(s)</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

