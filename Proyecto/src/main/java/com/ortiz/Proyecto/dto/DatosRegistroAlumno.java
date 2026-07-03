package com.ortiz.Proyecto.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para registrar o actualizar un Alumno.
 * visitanteId es el ID del apoderado (Visitante); puede ser null si no tiene.
 */
public record DatosRegistroAlumno(
        @NotBlank String nombre,
        @NotBlank String grado,
        @NotBlank String seccion,
        Long visitanteId // ID del apoderado — opcional
) {
}
