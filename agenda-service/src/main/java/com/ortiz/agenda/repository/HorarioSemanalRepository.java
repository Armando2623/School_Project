package com.ortiz.agenda.repository;

import com.ortiz.agenda.domain.DiaSemana;
import com.ortiz.agenda.domain.HorarioSemanal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad HorarioSemanal.
 */
@Repository
public interface HorarioSemanalRepository extends JpaRepository<HorarioSemanal, Long> {

    /** Todos los horarios de un profesor, ordenados por día y hora */
    List<HorarioSemanal> findByProfesorIdOrderByDiaSemanaAscHoraInicioAsc(Long profesorId);

    /** Horarios activos de un profesor */
    List<HorarioSemanal> findByProfesorIdAndActivoOrderByDiaSemanaAscHoraInicioAsc(
            Long profesorId, boolean activo);

    /** Todos los horarios de un día de la semana */
    List<HorarioSemanal> findByDiaSemanaOrderByHoraInicioAsc(DiaSemana diaSemana);

    /** Horarios activos de un día de la semana */
    List<HorarioSemanal> findByDiaSemanaAndActivoOrderByHoraInicioAsc(DiaSemana diaSemana, boolean activo);

    /** Todos los horarios activos (para listar el horario general del colegio) */
    List<HorarioSemanal> findByActivoOrderByDiaSemanaAscHoraInicioAsc(boolean activo);
}
