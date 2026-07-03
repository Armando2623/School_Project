package com.ortiz.agenda.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

/**
 * Entidad que representa un bloque de horario semanal fijo de un profesor.
 *
 * Almacena el día de la semana, hora de inicio y fin, materia y aula.
 * El campo profesorId referencia la tabla 'profesor' del MVC principal
 * sin FK de JPA para mantener la independencia entre microservicios.
 *
 * Tabla: horario_semanal (en colegio_db)
 */
@Entity
@Table(name = "horario_semanal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class HorarioSemanal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID del profesor en la tabla 'profesor' del MVC principal.
     * Referencia lógica — no es FK de JPA.
     */
    @Column(nullable = false)
    private Long profesorId;

    /** Nombre completo del profesor (desnormalizado para independencia del servicio) */
    @Column(nullable = false, length = 150)
    private String nombreProfesor;

    /** Día de la semana en que ocurre este bloque */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private DiaSemana diaSemana;

    /** Hora de inicio del bloque horario */
    @Column(nullable = false)
    private LocalTime horaInicio;

    /** Hora de fin del bloque horario */
    @Column(nullable = false)
    private LocalTime horaFin;

    /** Materia o asignatura que dicta el profesor en este bloque */
    @Column(nullable = false, length = 100)
    private String materia;

    /** Aula o salón donde se dicta la clase */
    @Column(length = 50)
    private String aula;

    /** Indica si este horario está actualmente vigente */
    @Column(nullable = false)
    private boolean activo;

    /** Observaciones adicionales sobre el bloque (opcional) */
    @Column(length = 300)
    private String observaciones;

    @PrePersist
    protected void onCreate() {
        this.activo = true;
    }
}
