package com.ortiz.agenda.repository;

import com.ortiz.agenda.domain.AgendaProfesor;
import com.ortiz.agenda.domain.DiaSemana;
import com.ortiz.agenda.domain.EstadoAgenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio JPA para la entidad AgendaProfesor.
 */
@Repository
public interface AgendaProfesorRepository extends JpaRepository<AgendaProfesor, Long> {

    /** Todos los eventos de un profesor específico */
    List<AgendaProfesor> findByProfesorIdOrderByFechaInicioAsc(Long profesorId);

    /** Eventos de un profesor filtrados por estado */
    List<AgendaProfesor> findByProfesorIdAndEstadoOrderByFechaInicioAsc(Long profesorId, EstadoAgenda estado);

    /** Eventos que caen dentro de un rango de fechas */
    List<AgendaProfesor> findByFechaInicioBetweenOrderByFechaInicioAsc(
            LocalDateTime desde, LocalDateTime hasta);

    /** Eventos de un profesor en un rango de fechas */
    List<AgendaProfesor> findByProfesorIdAndFechaInicioBetweenOrderByFechaInicioAsc(
            Long profesorId, LocalDateTime desde, LocalDateTime hasta);

    /** Eventos recurrentes de un día de la semana específico */
    List<AgendaProfesor> findByRecurrenteAndDiaSemana(boolean recurrente, DiaSemana diaSemana);

    /** Todos los eventos de un profesor ordenados por fecha */
    List<AgendaProfesor> findAllByOrderByFechaInicioAsc();
}
