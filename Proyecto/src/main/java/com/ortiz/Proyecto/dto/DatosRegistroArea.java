package com.ortiz.Proyecto.dto;

import jakarta.validation.constraints.NotBlank;

public record DatosRegistroArea(
    @NotBlank String nombre,
    String tipo,
    String descripcion
) {}
