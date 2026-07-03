import { api } from './client.js';
export const visitasApi = {
  listar:         ()         => api.get('/visitas'),
  registrar:      (body)     => api.post('/visitas', body),
  actualizar:     (id, body) => api.put(`/visitas/${id}`, body),
  buscarPorDni:   (dni)      => api.get(`/visitas/visitante?dni=${encodeURIComponent(dni)}`),
  buscarUsuarios: (search)   => api.get(`/visitas/usuarios?search=${encodeURIComponent(search)}`),
};
