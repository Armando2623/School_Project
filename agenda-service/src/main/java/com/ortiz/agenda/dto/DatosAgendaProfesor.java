package com.ortiz.agenda.dto;

import com.ortiz.agenda.domain.DiaSemana;
import com.ortiz.agenda.domain.EstadoAgenda;
import com.ortiz.agenda.domain.TipoAgenda;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO de entrada para crear o actualizar un evento en la agenda de un profesor.
 */
@Getter
@Setter
public class DatosAgendaProfesor {

    /** ID del profesor en la tabla 'profesor' */
    @NotNull(message = "El ID del profesor es obligatorio")
    private Long profesorId;

    /** Nombre completo del profesor */
    @NotBlank(message = "El nombre del profesor es obligatorio")
    private String nombreProfesor;

    /** Especialidad del profesor (opcional) */
    private String especialidad;

    /** Título descriptivo del evento */
    @NotBlank(message = "El título del evento es obligatorio")
    private String titulo;

    /** Descripción detallada (opcional) */
    private String descripcion;

    /** Fecha y hora de inicio */
    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime fechaInicio;

    /** Fecha y hora de fin */
    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDateTime fechaFin;

    /** Tipo de evento (HORARIO_ATENCION, REUNION, ACTIVIDAD, OTRO) */
    @NotNull(message = "El tipo de agenda es obligatorio")
    private TipoAgenda tipoAgenda;

    /** Estado del evento (por defecto ACTIVO si no se especifica) */
    private EstadoAgenda estado;

    /** Lugar del evento (opcional) */
    private String lugar;

    /** ¿El evento se repite semanalmente? */
    private boolean recurrente;

    /** Día de la semana (requerido si recurrente = true) */
    private DiaSemana diaSemana;
}
