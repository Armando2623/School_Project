package com.ortiz.asistencia.repository;

import com.ortiz.asistencia.domain.RegistroAsistenciaAlumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio JPA para los registros de asistencia de alumnos.
 */
public interface AsistenciaAlumnoRepository extends JpaRepository<RegistroAsistenciaAlumno, Long> {

    /** Obtiene todos los registros de un alumno por su alumnoId */
    List<RegistroAsistenciaAlumno> findByAlumnoIdOrderByHoraEventoDesc(Long alumnoId);

    /** Obtiene registros dentro de un rango de fechas (para reportes diarios) */
    List<RegistroAsistenciaAlumno> findByHoraEventoBetweenOrderByHoraEventoAsc(
            LocalDateTime inicio,
            LocalDateTime fin
    );

    /** Obtiene registros de un grado específico en un rango de fechas */
    @Query("SELECT r FROM RegistroAsistenciaAlumno r " +
           "WHERE r.grado = :grado " +
           "AND r.horaEvento BETWEEN :inicio AND :fin " +
           "ORDER BY r.horaEvento ASC")
    List<RegistroAsistenciaAlumno> findByGradoAndFecha(
            @Param("grado") String grado,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );

    /** Obtiene registros de un alumno específico en un rango de fechas */
    @Query("SELECT r FROM RegistroAsistenciaAlumno r " +
           "WHERE r.alumnoId = :alumnoId " +
           "AND r.horaEvento BETWEEN :inicio AND :fin " +
           "ORDER BY r.horaEvento ASC")
    List<RegistroAsistenciaAlumno> findByAlumnoIdAndFecha(
            @Param("alumnoId") Long alumnoId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );
}
