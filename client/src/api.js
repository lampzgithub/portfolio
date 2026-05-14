const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `request failed (${res.status})`);
  return data;
}

export const api = {
  getProjects: () => request('/api/projects'),
  getProject: (id) => request(`/api/projects/${id}`),
  createProject: (body) => request('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (id, body) =>
    request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProject: (id) => request(`/api/projects/${id}`, { method: 'DELETE' }),
  login: (username, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
};
