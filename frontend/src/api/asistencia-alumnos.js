import { astApi } from './client.js';

export const asistenciaAlumnosApi = {
  /** Registra asistencia de alumno via QR */
  registrar:         (body)        => astApi.post('/asistencia/alumnos', body),

  /** Lista todos los registros de asistencia de alumnos */
  listar:            ()            => astApi.get('/asistencia/alumnos'),

  /** Obtiene un registro por ID */
  obtenerPorId:      (id)          => astApi.get(`/asistencia/alumnos/${id}`),

  /** Historial de un alumno específico */
  porAlumno:         (alumnoId)    => astApi.get(`/asistencia/alumnos/alumno/${alumnoId}`),

  /** Registros de una fecha específica */
  porFecha:          (fecha)       => astApi.get(`/asistencia/alumnos/fecha?fecha=${fecha}`),

  /** Registros de un alumno en una fecha */
  porAlumnoYFecha:   (id, fecha)   => astApi.get(`/asistencia/alumnos/alumno/${id}/fecha?fecha=${fecha}`),

  /** Registros de un grado en una fecha */
  porGradoYFecha:    (grado, fecha) => astApi.get(`/asistencia/alumnos/grado/${encodeURIComponent(grado)}/fecha?fecha=${fecha}`),
};
