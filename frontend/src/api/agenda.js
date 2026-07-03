import { agendaApi } from './client.js';

export const agendaApiClient = {
  // ── Agenda ─────────────────────────────────────────────────────────────────
  listarTodos:            ()                  => agendaApi.get('/agenda'),
  listarPorProfesor:      (profesorId)        => agendaApi.get(`/agenda/profesor/${profesorId}`),
  listarPorFecha:         (fecha)             => agendaApi.get(`/agenda/fecha?fecha=${fecha}`),
  listarPorProfesorFecha: (profesorId, fecha) => agendaApi.get(`/agenda/profesor/${profesorId}/fecha?fecha=${fecha}`),
  listarPorEstado:        (profesorId, estado)=> agendaApi.get(`/agenda/profesor/${profesorId}/estado/${estado}`),
  listarRecurrentes:      (dia)               => agendaApi.get(`/agenda/recurrentes/${dia}`),
  crear:                  (body)              => agendaApi.post('/agenda', body),
  actualizar:             (id, body)          => agendaApi.put(`/agenda/${id}`, body),
  eliminar:               (id)               => agendaApi.delete(`/agenda/${id}`),

  // ── Horarios semanales ─────────────────────────────────────────────────────
  listarHorarios:             ()          => agendaApi.get('/horarios'),
  listarHorariosPorProfesor:  (profesorId)=> agendaApi.get(`/horarios/profesor/${profesorId}`),
  listarHorariosPorDia:       (dia)       => agendaApi.get(`/horarios/dia/${dia}`),
  crearHorario:               (body)      => agendaApi.post('/horarios', body),
  actualizarHorario:          (id, body)  => agendaApi.put(`/horarios/${id}`, body),
  eliminarHorario:            (id)        => agendaApi.delete(`/horarios/${id}`),
};
