package com.ortiz.asistencia.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * DTO para deserializar la respuesta del MVC (GET /api/alumnos/qr/{codigoQr}).
 * Incluye los datos del alumno más la información de contacto del apoderado,
 * para poder enviar notificaciones de asistencia al padre/madre/tutor.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record AlumnoInfoDto(
        Long   id,
        String nombre,
        String grado,
        String seccion,
        String codigoQr,
        // Datos del apoderado — pueden ser null si el alumno no tiene apoderado registrado
        String emailApoderado,
        String nombreApoderado,
        String telefonoApoderado
) {}

