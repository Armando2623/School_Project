import { api } from './client.js';

export const inventarioApi = {
  // Áreas
  listarAreas:   ()         => api.get('/inventario/areas'),
  registrarArea: (body)     => api.post('/inventario/areas', body),

  // Artículos
  listarArticulos: (areaId) => {
    const query = areaId ? `?areaId=${areaId}` : '';
    return api.get(`/inventario/articulos${query}`);
  },
  registrarArticulo: (body)     => api.post('/inventario/articulos', body),
  actualizarArticulo: (id, body) => api.put(`/inventario/articulos/${id}`, body),
  eliminarArticulo:   (id)       => api.delete(`/inventario/articulos/${id}`),
  buscarPorCodigo:    (codigo)   => api.get(`/inventario/articulos/codigo/${codigo}`),
};
