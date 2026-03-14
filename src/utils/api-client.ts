import { supabase } from '@/lib/supabase';

const API_URL = import.meta.env.VITE_API_URL as string;

export class ApiError extends Error {
  status: number;
  path: string;

  constructor(message: string, status: number, path: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.path = path;
  }
}

async function buildHeaders(withBody = false): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (withBody) headers['Content-Type'] = 'application/json';
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function throwApiError(res: Response, method: string, path: string): Promise<never> {
  const body = await res.json().catch(() => ({})) as { message?: string };
  const fallback = `${method} ${path} failed: ${res.status}`;
  throw new ApiError(body.message ?? fallback, res.status, path);
}

const api = {
  get: async <T>(path: string): Promise<{ data: T }> => {
    const res = await fetch(`${API_URL}${path}`, { headers: await buildHeaders() });
    if (!res.ok) {
      await throwApiError(res, 'GET', path);
    }
    return res.json() as Promise<{ data: T }>;
  },

  getRaw: async <T>(path: string): Promise<T> => {
    const res = await fetch(`${API_URL}${path}`, { headers: await buildHeaders() });
    if (!res.ok) {
      await throwApiError(res, 'GET', path);
    }
    return res.json() as Promise<T>;
  },

  post: async <T>(path: string, body?: unknown): Promise<{ data: T }> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: await buildHeaders(true),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      await throwApiError(res, 'POST', path);
    }
    return res.json() as Promise<{ data: T }>;
  },

  // Send multipart/form-data without forcing JSON content-type.
  postForm: async <T>(path: string, formData: FormData): Promise<{ data: T }> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: await buildHeaders(false),
      body: formData,
    });
    if (!res.ok) {
      await throwApiError(res, 'POST', path);
    }
    return res.json() as Promise<{ data: T }>;
  },

  patch: async <T>(path: string, body?: unknown): Promise<{ data: T }> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: await buildHeaders(true),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      await throwApiError(res, 'PATCH', path);
    }
    return res.json() as Promise<{ data: T }>;
  },

  delete: async <T>(path: string): Promise<{ data: T }> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: await buildHeaders(),
    });
    if (!res.ok) {
      await throwApiError(res, 'DELETE', path);
    }
    return res.json() as Promise<{ data: T }>;
  },
};

export default api;
