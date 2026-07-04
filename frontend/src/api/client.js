import { store } from '../auth/store.js';

// ── URLs de los servicios en Render (producción) ──────────────────────────────
const MVC_URL       = 'https://school-project-1mso.onrender.com';
const AST_URL       = 'https://school-project-assitencia-service.onrender.com';
const AGENDA_URL    = 'https://school-project-agendaservice.onrender.com';

const BASE          = `${MVC_URL}/api`;
const BASE_AST      = `${AST_URL}/api`;
const BASE_AGENDA   = `${AGENDA_URL}/api`;

async function request(base, path, options = {}) {
  const token = store.token();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, { ...options, headers });

  // 401 = token inválido/expirado → limpiar sesión y redirigir al login
  if (res.status === 401) {
    store.clear();
    window.location.hash = '#/login';
    throw new Error('Sesión expirada');
  }
  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `Error ${res.status}` }));
    throw new Error(err.error || err.message || `Error ${res.status}`);
  }
  return res.json();
}

/** Cliente para el MVC principal → https://school-project-1mso.onrender.com */
export const api = {
  get:       (path)         => request(BASE, path),
  post:      (path, body)   => request(BASE, path, { method: 'POST',   body: JSON.stringify(body) }),
  put:       (path, body)   => request(BASE, path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete:    (path)         => request(BASE, path, { method: 'DELETE' }),

  /** Descarga un blob (imagen, PDF) con autenticación JWT */
  fetchBlob: async (path) => {
    const token = store.token();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE}${path}`, { headers });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.blob();
  },
};

/** Cliente para asistencia-service → https://school-project-assitencia-service.onrender.com */
export const astApi = {
  get:  (path)       => request(BASE_AST, path),
  post: (path, body) => request(BASE_AST, path, { method: 'POST', body: JSON.stringify(body) }),
};

/** Cliente para agenda-service → https://school-project-agendaservice.onrender.com */
export const agendaApi = {
  get:    (path)       => request(BASE_AGENDA, path),
  post:   (path, body) => request(BASE_AGENDA, path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body) => request(BASE_AGENDA, path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)       => request(BASE_AGENDA, path, { method: 'DELETE' }),
};