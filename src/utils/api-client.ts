import { supabase } from '@/lib/supabase';

const API_URL = import.meta.env.VITE_API_URL as string;

async function buildHeaders(withBody = false): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (withBody) headers['Content-Type'] = 'application/json';
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

const api = {
  get: async <T>(path: string): Promise<{ data: T }> => {
    const res = await fetch(`${API_URL}${path}`, { headers: await buildHeaders() });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json() as Promise<{ data: T }>;
  },

  post: async <T>(path: string, body?: unknown): Promise<{ data: T }> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: await buildHeaders(true),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json() as Promise<{ data: T }>;
  },

  patch: async <T>(path: string, body?: unknown): Promise<{ data: T }> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: await buildHeaders(true),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
    return res.json() as Promise<{ data: T }>;
  },

  delete: async <T>(path: string): Promise<{ data: T }> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: await buildHeaders(),
    });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return res.json() as Promise<{ data: T }>;
  },
};

export default api;
