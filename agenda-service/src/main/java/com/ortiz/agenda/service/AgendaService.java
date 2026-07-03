package com.ortiz.agenda.service;

import com.ortiz.agenda.domain.AgendaProfesor;
import com.ortiz.agenda.domain.DiaSemana;
import com.ortiz.agenda.domain.EstadoAgenda;
import com.ortiz.agenda.dto.DatosAgendaProfesor;
import com.ortiz.agenda.repository.AgendaProfesorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de lógica de negocio para la agenda de profesores.
 *
 * Gestiona la creación, actualización, consulta y eliminación
 * de eventos en la agenda de cada profesor.
 */
@Service
public class AgendaService {

    @Autowired
    private AgendaProfesorRepository agendaRepository;

    /**
     * Crea un nuevo evento en la agenda.
     * Si el estado no se especifica en el DTO, se establece como ACTIVO.
     */
    @Transactional
    public AgendaProfesor crear(DatosAgendaProfesor datos) {
        AgendaProfesor agenda = new AgendaProfesor();
        mapearDatos(datos, agenda);
        if (agenda.getEstado() == null) {
            agenda.setEstado(EstadoAgenda.ACTIVO);
        }
        return agendaRepository.save(agenda);
    }

    /**
     * Actualiza un evento existente por su ID.
     * Lanza EntityNotFoundException si el evento no existe.
     */
    @Transactional
    public AgendaProfesor actualizar(Long id, DatosAgendaProfesor datos) {
        AgendaProfesor agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Evento de agenda no encontrado con ID: " + id));
        mapearDatos(datos, agenda);
        return agendaRepository.save(agenda);
    }

    /**
     * Elimina un evento de la agenda por su ID.
     */
    @Transactional
    public void eliminar(Long id) {
        if (!agendaRepository.existsById(id)) {
            throw new EntityNotFoundException("Evento de agenda no encontrado con ID: " + id);
        }
        agendaRepository.deleteById(id);
    }

    /** Lista todos los eventos de la agenda, ordenados por fecha de inicio. */
    public List<AgendaProfesor> listarTodos() {
        return agendaRepository.findAllByOrderByFechaInicioAsc();
    }

    /** Obtiene un evento por su ID. */
    public Optional<AgendaProfesor> obtenerPorId(Long id) {
        return agendaRepository.findById(id);
    }

    /** Lista todos los eventos de un profesor, ordenados por fecha. */
    public List<AgendaProfesor> listarPorProfesor(Long profesorId) {
        return agendaRepository.findByProfesorIdOrderByFechaInicioAsc(profesorId);
    }

    /** Lista los eventos de un profesor filtrados por estado. */
    public List<AgendaProfesor> listarPorProfesorYEstado(Long profesorId, EstadoAgenda estado) {
        return agendaRepository.findByProfesorIdAndEstadoOrderByFechaInicioAsc(profesorId, estado);
    }

    /**
     * Lista todos los eventos que ocurren en una fecha específica.
     * Busca eventos cuya fechaInicio cae dentro del día (00:00:00 a 23:59:59).
     */
    public List<AgendaProfesor> listarPorFecha(LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin    = fecha.atTime(LocalTime.MAX);
        return agendaRepository.findByFechaInicioBetweenOrderByFechaInicioAsc(inicio, fin);
    }

    /**
     * Lista los eventos de un profesor en una fecha específica.
     */
    public List<AgendaProfesor> listarPorProfesorYFecha(Long profesorId, LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin    = fecha.atTime(LocalTime.MAX);
        return agendaRepository.findByProfesorIdAndFechaInicioBetweenOrderByFechaInicioAsc(
                profesorId, inicio, fin);
    }

    /** Lista los eventos recurrentes de un día de la semana. */
    public List<AgendaProfesor> listarRecurrentesPorDia(DiaSemana diaSemana) {
        return agendaRepository.findByRecurrenteAndDiaSemana(true, diaSemana);
    }

    // ── Métodos internos ──────────────────────────────────────────────────────

    private void mapearDatos(DatosAgendaProfesor datos, AgendaProfesor agenda) {
        agenda.setProfesorId(datos.getProfesorId());
        agenda.setNombreProfesor(datos.getNombreProfesor());
        agenda.setEspecialidad(datos.getEspecialidad());
        agenda.setTitulo(datos.getTitulo());
        agenda.setDescripcion(datos.getDescripcion());
        agenda.setFechaInicio(datos.getFechaInicio());
        agenda.setFechaFin(datos.getFechaFin());
        agenda.setTipoAgenda(datos.getTipoAgenda());
        agenda.setEstado(datos.getEstado());
        agenda.setLugar(datos.getLugar());
        agenda.setRecurrente(datos.isRecurrente());
        agenda.setDiaSemana(datos.getDiaSemana());
    }
}
