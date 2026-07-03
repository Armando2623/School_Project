import { api } from './client.js';

export const alumnosApi = {
  listar:       ()         => api.get('/alumnos'),
  registrar:    (body)     => api.post('/alumnos', body),
  actualizar:   (id, body) => api.put(`/alumnos/${id}`, body),
  obtener:      (id)       => api.get(`/alumnos/${id}`),

  /**
   * Descarga la imagen QR del alumno como Blob (para mostrar en <img> o descargar).
   * Usa fetchBlob para adjuntar el JWT de autenticación.
   */
  obtenerQrBlob: (id) => api.fetchBlob(`/alumnos/${id}/qr`),
};
