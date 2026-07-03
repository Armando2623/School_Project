// Gestiona el token JWT y datos del usuario en sessionStorage
const KEY = 'sg_session';

export const store = {
  save(data) {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  },
  get() {
    try { return JSON.parse(sessionStorage.getItem(KEY)); }
    catch { return null; }
  },
  clear() { sessionStorage.removeItem(KEY); },
  token()    { return this.get()?.token    ?? null; },
  usuario()  { return this.get()?.usuario  ?? null; },
  nombre()   { return this.get()?.nombre   ?? null; },
  rol()      { return this.get()?.rol      ?? null; },
  id()       { return this.get()?.id       ?? null; },
  isLogged() { return !!this.token(); },
  hasRole(...roles) { return roles.includes(this.rol()); },
};
