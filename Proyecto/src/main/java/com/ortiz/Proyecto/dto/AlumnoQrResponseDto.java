package com.ortiz.Proyecto.dto;

/**
 * DTO de respuesta para el endpoint GET /api/alumnos/qr/{codigoQr}.
 *
 * Incluye los datos del alumno más la información de contacto del apoderado,
 * para que el microservicio asistencia-service pueda enviar notificaciones
 * al padre/madre/tutor cuando se registra la asistencia del alumno.
 */
public record AlumnoQrResponseDto(
        Long   id,
        String nombre,
        String grado,
        String seccion,
        String codigoQr,
        // Datos del apoderado (null si el alumno no tiene apoderado registrado)
        String emailApoderado,
        String nombreApoderado,
        String telefonoApoderado
) {}
