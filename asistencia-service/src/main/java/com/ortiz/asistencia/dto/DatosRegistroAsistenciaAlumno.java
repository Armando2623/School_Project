package com.ortiz.asistencia.dto;

import com.ortiz.asistencia.domain.TipoEvento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/**
 * DTO de entrada para registrar un evento de asistencia de un alumno via QR.
 *
 * Ejemplo de JSON:
 * {
 *   "codigoQr": "550e8400-e29b-41d4-a716-446655440000",
 *   "tipoEvento": "ENTRADA",
 *   "horaEvento": null,
 *   "registradoPorId": 1,
 *   "observaciones": null
 * }
 */
public record DatosRegistroAsistenciaAlumno(
        @NotBlank String codigoQr,                // UUID escaneado del alumno
        @NotNull TipoEvento tipoEvento,            // ENTRADA o SALIDA
        LocalDateTime horaEvento,                  // null = usa LocalDateTime.now()
        Long registradoPorId,                      // ID del portero/admin que registra
        String observaciones                       // opcional
) {}
