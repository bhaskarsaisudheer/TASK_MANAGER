// Base URL for all API requests.
// In production, set VITE_API_URL to the API service's domain
// (e.g. https://api-production-xxxxx.up.railway.app).
// In development, this defaults to an empty string so that Vite's
// proxy (configured in vite.config.ts) handles /api/* requests.
export const API_URL: string = import.meta.env.VITE_API_URL ?? "";
