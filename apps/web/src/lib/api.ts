import { useAuth } from "../state/auth";

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const headers = new Headers(opts.headers);
  headers.set("content-type", "application/json");
  if (opts.token) headers.set("authorization", `Bearer ${opts.token}`);

  const res = await fetch(path, { ...opts, headers });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      msg = j?.error ?? msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export function useApi() {
  const { token } = useAuth();
  return {
    get: <T,>(path: string) => apiFetch<T>(path, { token }),
    post: <T,>(path: string, body?: unknown) =>
      apiFetch<T>(path, { method: "POST", body: JSON.stringify(body ?? {}), token }),
    patch: <T,>(path: string, body?: unknown) =>
      apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}), token }),
  };
}

