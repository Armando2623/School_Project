package com.ortiz.agenda.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad que representa un evento en la agenda de un profesor.
 *
 * Puede ser un horario de atención, reunión, actividad u otro.
 * El campo profesorId referencia la tabla 'profesor' del MVC principal
 * sin FK de JPA para mantener independencia entre microservicios.
 *
 * Tabla: agenda_profesor (en colegio_db)
 */
@Entity
@Table(name = "agenda_profesor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class AgendaProfesor {

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

    /** Especialidad del profesor (desnormalizado) */
    @Column(length = 100)
    private String especialidad;

    /** Título descriptivo del evento */
    @Column(nullable = false, length = 200)
    private String titulo;

    /** Descripción detallada del evento */
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    /** Fecha y hora de inicio del evento */
    @Column(nullable = false)
    private LocalDateTime fechaInicio;

    /** Fecha y hora de fin del evento */
    @Column(nullable = false)
    private LocalDateTime fechaFin;

    /** Tipo de evento en la agenda */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoAgenda tipoAgenda;

    /** Estado actual del evento */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoAgenda estado;

    /** Lugar físico del evento (aula, sala de reuniones, etc.) */
    @Column(length = 200)
    private String lugar;

    /**
     * Indica si este evento se repite semanalmente.
     * Si es true, se usa el campo diaSemana para identificar el día de recurrencia.
     */
    @Column(nullable = false)
    private boolean recurrente;

    /**
     * Día de la semana en que ocurre el evento (solo si recurrente = true).
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private DiaSemana diaSemana;

    /** Fecha y hora en que se registró este evento */
    @Column(nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    /** Última modificación del evento */
    private LocalDateTime actualizadoEn;

    @PrePersist
    protected void onCreate() {
        this.creadoEn = LocalDateTime.now();
        this.actualizadoEn = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoAgenda.ACTIVO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.actualizadoEn = LocalDateTime.now();
    }
}
