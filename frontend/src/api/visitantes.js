import { api } from './client.js';
export const visitantesApi = {
  listar:         ()         => api.get('/visitantes'),
  registrar:      (body)     => api.post('/visitantes', body),
  actualizar:     (id, body) => api.put(`/visitantes/${id}`, body),
  buscarPorDni:   (dni)      => api.get(`/visitantes/buscar?dni=${encodeURIComponent(dni)}`),
};
