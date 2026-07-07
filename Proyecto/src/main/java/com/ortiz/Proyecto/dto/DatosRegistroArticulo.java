package com.ortiz.Proyecto.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record DatosRegistroArticulo(
    @NotBlank String nombre,
    String descripcion,
    String codigoBarras,
    String estado,
    @NotNull @Min(1) Integer cantidad,
    @NotNull Long areaId,
    List<String> fotos // Lista de imágenes en Base64
) {}
