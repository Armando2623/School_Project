import { api } from './client.js';
export const authApi = {
  login: (usuario, contraseña) => api.post('/auth/login', { usuario, contraseña }),
};
