import { astApi } from './client.js';
export const asistenciaApi = {
  listar:             ()            => astApi.get('/asistencia'),
  registrar:          (body)        => astApi.post('/asistencia', body),
  porPersonal:        (id)          => astApi.get(`/asistencia/personal/${id}`),
  porFecha:           (fecha)       => astApi.get(`/asistencia/fecha?fecha=${fecha}`),
  porPersonalYFecha:  (id, fecha)   => astApi.get(`/asistencia/personal/${id}/fecha?fecha=${fecha}`),
};
