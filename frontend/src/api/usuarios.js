import { api } from './client.js';
export const usuariosApi = {
  listar:     ()         => api.get('/usuarios'),
  registrar:  (body)     => api.post('/usuarios', body),
  actualizar: (id, body) => api.put(`/usuarios/${id}`, body),
  eliminar:   (id)       => api.delete(`/usuarios/${id}`),
};
