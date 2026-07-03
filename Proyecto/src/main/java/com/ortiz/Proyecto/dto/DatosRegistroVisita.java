package com.ortiz.Proyecto.dto;

import com.ortiz.Proyecto.domain.EstadoRegistro;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DatosRegistroVisita(
        @NotBlank String dniVisitante,
        @NotBlank String nombreVisitante,
        @NotBlank String motivo,
        LocalDateTime horaIngreso,
        @NotNull Long usuario_id,
        EstadoRegistro estadoRegistro) {
}
