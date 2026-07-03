package com.ortiz.asistencia.dto;

import com.ortiz.asistencia.domain.TipoEvento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/**
 * DTO de entrada para registrar un evento de asistencia del personal.
 *
 * Ejemplo de JSON:
 * {
 *   "usuarioId": 3,
 *   "nombrePersonal": "María López",
 *   "rolPersonal": "SECRETARIA",
 *   "tipoEvento": "ENTRADA",
 *   "horaEvento": null,
 *   "observaciones": "Llegó 10 min tarde"
 * }
 */
public record DatosRegistroAsistencia(
        @NotNull Long usuarioId,
        @NotBlank String nombrePersonal,
        @NotBlank String rolPersonal,
        @NotNull TipoEvento tipoEvento,
        LocalDateTime horaEvento,       // si null, se usa LocalDateTime.now()
        String observaciones            // opcional
) {}
