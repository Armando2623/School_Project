package com.ortiz.agenda.dto;

import com.ortiz.agenda.domain.DiaSemana;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

/**
 * DTO de entrada para crear o actualizar un bloque de horario semanal.
 */
@Getter
@Setter
public class DatosHorarioSemanal {

    /** ID del profesor en la tabla 'profesor' */
    @NotNull(message = "El ID del profesor es obligatorio")
    private Long profesorId;

    /** Nombre completo del profesor */
    @NotBlank(message = "El nombre del profesor es obligatorio")
    private String nombreProfesor;

    /** Día de la semana del bloque */
    @NotNull(message = "El día de la semana es obligatorio")
    private DiaSemana diaSemana;

    /** Hora de inicio del bloque */
    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;

    /** Hora de fin del bloque */
    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;

    /** Materia o asignatura */
    @NotBlank(message = "La materia es obligatoria")
    private String materia;

    /** Aula o salón (opcional) */
    private String aula;

    /** ¿El horario está activo? (por defecto true al crear) */
    private Boolean activo;

    /** Observaciones adicionales (opcional) */
    private String observaciones;
}
