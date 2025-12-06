/*
 * Lightweight API adapter with safe local fallbacks.
 * - Uses `import.meta.env.VITE_USE_REMOTE_API` and `VITE_API_BASE_URL` to call remote endpoints.
 * - Falls back to local `src/data/products.ts` when remote is disabled or fails.
 */
import type { Product, Ingredient } from "@/data/products";

let API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "";
let USE_REMOTE = (import.meta.env.VITE_USE_REMOTE_API as string) === "true" && !!API_BASE;

/**
 * Test helpers: allows tests to override adapter configuration at runtime.
 * - Use `__setTestConfig` from tests to force `useRemote` and `apiBase` values.
 * - Use `__resetConfig` to restore values from `import.meta.env`.
 */
export function __setTestConfig(cfg: { apiBase?: string; useRemote?: boolean }) {
  if (typeof cfg.apiBase !== "undefined") API_BASE = cfg.apiBase;
  if (typeof cfg.useRemote !== "undefined") USE_REMOTE = cfg.useRemote;
}

export function __resetConfig() {
  API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "";
  USE_REMOTE = (import.meta.env.VITE_USE_REMOTE_API as string) === "true" && !!API_BASE;
}

async function fetchJson(input: RequestInfo, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    // Attach auth header if token present in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('tt_token') : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const mergedInit: RequestInit = {
      ...init,
      headers: { ...(init && (init.headers as Record<string, string>)), ...authHeaders },
      signal: controller.signal,
    };

    const res = await fetch(input, mergedInit);
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

/** Get list of products. Remote endpoint optional — not required by UI. */
export async function getAllProducts(): Promise<Product[]> {
  if (USE_REMOTE) {
    try {
      const url = `${API_BASE}/api/products`;
      const data = await fetchJson(url);
      if (Array.isArray(data)) return data as Product[];
    } catch (e) {
      // ignore and fall back
    }
  }

  const mod = await import("@/data/products");
  return mod.products;
}

/** Get single product by id (prefers remote when enabled). */
export async function getProductById(id: string): Promise<Product | undefined> {
  if (USE_REMOTE) {
    try {
      const url = `${API_BASE}/api/product/${encodeURIComponent(id)}`;
      const data = await fetchJson(url);
      return data as Product;
    } catch (e) {
      // fall back
    }
  }

  const mod = await import("@/data/products");
  return mod.products.find((p) => p.id === id);
}

/** Get product by barcode. Remote endpoint optional — falls back to local dataset. */
export async function getProductByBarcode(barcode: string): Promise<Product | undefined> {
  if (USE_REMOTE) {
    try {
      const url = `${API_BASE}/api/products/barcode/${encodeURIComponent(barcode)}`;
      const data = await fetchJson(url);
      return data as Product;
    } catch (e) {
      // fall back to local
    }
  }

  const mod = await import("@/data/products");
  return mod.products.find((p) => (p as any).barcode === barcode);
}

/** Analyze ingredients: returns per-ingredient explanations and scores.
 * If remote analysis is unavailable, a conservative local analysis is returned.
 */
export async function analyzeIngredients(
  productId: string | undefined,
  ingredients: Ingredient[],
  userProfileId?: string,
): Promise<{
  productId?: string;
  ingredients: Array<{
    id: number;
    name: string;
    healthScore: number;
    ecoScore: number;
    explanation?: string;
    sourcing?: { origin?: string; certifications?: string[]; sustainabilityNotes?: string };
  }>;
  aggregateScores: { health: number; eco: number };
  generatedAt: string;
}> {
  if (USE_REMOTE) {
    try {
      const url = `${API_BASE}/api/ingredients/analyze`;
      const res = await fetchJson(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, ingredients, userProfileId }),
      });
      return res;
    } catch (e) {
      // fall back to local
    }
  }

  // Local heuristic analysis (non-blocking and explainable):
  const mapped = ingredients.map((ing) => {
    const healthScore = ing.healthImpact === "high" ? 85 : ing.healthImpact === "medium" ? 65 : ing.healthImpact === "low" ? 40 : 60;
    const ecoScore = ing.ecoImpact === "high" ? 80 : ing.ecoImpact === "medium" ? 60 : ing.ecoImpact === "low" ? 35 : 55;
    return {
      id: ing.id,
      name: ing.name,
      healthScore,
      ecoScore,
      explanation: ing.description || undefined,
      sourcing: { origin: ing.origin },
    };
  });

  const agg = {
    health: Math.round(mapped.reduce((s, i) => s + i.healthScore, 0) / Math.max(1, mapped.length)),
    eco: Math.round(mapped.reduce((s, i) => s + i.ecoScore, 0) / Math.max(1, mapped.length)),
  };

  return {
    productId,
    ingredients: mapped,
    aggregateScores: agg,
    generatedAt: new Date().toISOString(),
  };
}

// --- Authentication helpers (simple client-side token store) ---
export async function login(email: string, password: string): Promise<{ token: string; refreshToken?: string } | null> {
  if (!API_BASE || !USE_REMOTE) return null;
  try {
    const res = await fetchJson(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res?.token) {
      try { localStorage.setItem('tt_token', res.token); } catch {}
      try { if (res.refreshToken) localStorage.setItem('tt_refreshToken', res.refreshToken); } catch {}
      return { token: res.token, refreshToken: res.refreshToken };
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function logout(): void {
  try { localStorage.removeItem('tt_token'); } catch {}
  try { localStorage.removeItem('tt_refreshToken'); } catch {}
}

export async function register(email: string, password: string, name: string): Promise<boolean> {
  if (!API_BASE || !USE_REMOTE) return false;
  try {
    const res = await fetchJson(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return !!res?.userId;
  } catch (e) {
    return false;
  }
}

// --- Product submission endpoints ---
export async function submitProduct(payload: any): Promise<{ submissionId?: string; status?: string; message?: string }> {
  if (USE_REMOTE) {
    try {
      const res = await fetchJson(`${API_BASE}/api/products/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res;
    } catch (e) {
      // allow fallback below
    }
  }

  // Local fallback: return a fake pending submission
  return { submissionId: `local-${Date.now()}`, status: 'pending_review', message: 'Local fallback: submission queued' };
}

export async function getMySubmissions(): Promise<any[]> {
  if (USE_REMOTE) {
    try {
      const res = await fetchJson(`${API_BASE}/api/products/my-submissions`);
      return Array.isArray(res) ? res : [];
    } catch (e) {
      return [];
    }
  }
  return [];
}

/** Get user profile; remote only when enabled, returns null if not found. */
export async function getUserProfile(): Promise<null | { id: string; name?: string; preferences?: Record<string, unknown>; conditions?: string[] }> {
  if (USE_REMOTE) {
    try {
      const url = `${API_BASE}/api/user/profile`;
      const data = await fetchJson(url);
      return data;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export default {
  getAllProducts,
  getProductById,
  analyzeIngredients,
  getUserProfile,
};
