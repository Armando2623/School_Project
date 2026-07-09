import { store } from '../auth/store.js';

// ── URLs de los servicios en Render (producción) ──────────────────────────────
const _BUILD_V      = '2';   // incrementar para forzar nuevo hash de bundle
export const MVC_URL   = 'https://school-project-1mso.onrender.com';
export const AST_URL   = 'https://school-project-assitencia-service.onrender.com';
const AGENDA_URL       = 'https://school-project-agendaservice.onrender.com';

const BASE          = `${MVC_URL}/api`;
const BASE_AST      = `${AST_URL}/api`;
const BASE_AGENDA   = `${AGENDA_URL}/api`;

async function request(base, path, options = {}) {
  const token = store.token();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, { ...options, headers });

  // 401 = token inválido/expirado → solo limpiar si teníamos token (verdadera expiración)
  if (res.status === 401) {
    if (token) {
      store.clear();
      window.location.hash = '#/login';
    }
    throw new Error('Sesión expirada');
  }
  // 403 = autenticado pero sin permiso para este recurso (NO limpiar sesión)
  if (res.status === 403) {
    throw new Error('No tienes permiso para acceder a este recurso');
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