package com.ortiz.Proyecto.repository;

import com.ortiz.Proyecto.domain.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    List<Alumno> findByApoderadoId(Long visitanteId);

    /** Busca un alumno por su código QR (UUID único) */
    Optional<Alumno> findByCodigoQr(String codigoQr);

    /**
     * Busca un alumno por QR cargando el apoderado en la misma consulta (JOIN FETCH).
     * Usado por el endpoint /api/alumnos/qr/{codigoQr} para incluir el email del apoderado
     * en la respuesta, necesario para enviar notificaciones al registrar asistencia.
     */
    @Query("SELECT a FROM Alumno a LEFT JOIN FETCH a.apoderado WHERE a.codigoQr = :codigoQr")
    Optional<Alumno> findByCodigoQrWithApoderado(@Param("codigoQr") String codigoQr);
}
