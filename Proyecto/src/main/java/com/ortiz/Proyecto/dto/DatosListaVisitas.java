package com.ortiz.Proyecto.dto;

import com.ortiz.Proyecto.domain.EstadoRegistro;
import com.ortiz.Proyecto.domain.RegistroVisita;

import java.time.LocalDateTime;

/**
 * DTO de respuesta para listar visitas en el frontend.
 */
public record DatosListaVisitas(
        String nombreVisitante,
        String motivo,
        LocalDateTime horaIngreso,
        Long usuario_id,
        EstadoRegistro estadoRegistro) {

    // Constructor que mapea desde la entidad RegistroVisita
    public DatosListaVisitas(RegistroVisita registro) {
        this(
                registro.getNombreVisitante(),
                registro.getMotivo(),
                registro.getHoraIngreso(),
                registro.getUsuario() != null ? registro.getUsuario().getId() : null,
                registro.getEstadoRegistro());
    }
}
