package com.ortiz.asistencia.repository;

import com.ortiz.asistencia.domain.RegistroAsistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

/*
  Repositorio JPA para los registros de asistencia del personal.
 */
public interface AsistenciaRepository extends JpaRepository<RegistroAsistencia, Long> {

    /* Obtiene todos los registros de un miembro del personal por su usuarioId */
    List<RegistroAsistencia> findByUsuarioIdOrderByHoraEventoDesc(Long usuarioId);

    /* Obtiene registros dentro de un rango de fechas (para reportes diarios/semanales) */
    List<RegistroAsistencia> findByHoraEventoBetweenOrderByHoraEventoAsc(
            LocalDateTime inicio,
            LocalDateTime fin
    );

    /*
      Obtiene registros de un usuario específico en un rango de fechas.
      Útil para calcular horas trabajadas por día.
     */
    @Query("SELECT r FROM RegistroAsistencia r " +
           "WHERE r.usuarioId = :usuarioId " +
           "AND r.horaEvento BETWEEN :inicio AND :fin " +
           "ORDER BY r.horaEvento ASC")
    List<RegistroAsistencia> findByUsuarioIdAndFecha(
            @Param("usuarioId") Long usuarioId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );
}
