package com.ortiz.Proyecto.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para registrar o actualizar un Visitante (padre de familia, proveedor, etc.)
 */
public record DatosRegistroVisitante(
        @NotBlank String dniVisitante,
        @NotBlank String nombreVisitante,
        String telefono,
        String email) {
}
