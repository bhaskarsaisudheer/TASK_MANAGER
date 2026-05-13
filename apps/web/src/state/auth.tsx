import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type User = { id: string; name: string; email: string; createdAt: string };

type AuthState = {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

const TOKEN_KEY = "ttm_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  // Best-effort load user on refresh
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!token) return;
      try {
        const res = await fetch("/api/auth/me", { headers: { authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = (await res.json()) as { user: User };
        if (!cancelled) setUser(data.user);
      } catch {
        // ignore
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo<AuthState>(() => ({ token, user, setToken, setUser, logout }), [
    token,
    user,
    setToken,
    logout,
  ]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

