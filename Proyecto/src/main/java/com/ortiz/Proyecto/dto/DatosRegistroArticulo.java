package com.ortiz.Proyecto.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DatosRegistroArticulo(
    @NotBlank String nombre,
    String descripcion,
    String codigoBarras, // Si viene nulo o vacío, el servicio lo autogenera
    String estado,
    @NotNull @Min(1) Integer cantidad,
    @NotNull Long areaId
) {}
