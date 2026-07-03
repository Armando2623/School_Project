package com.ortiz.asistencia.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad que representa un evento de asistencia de un alumno del colegio.
 *
 * Almacena quién registró el evento (registradoPorId referencia al sistema MVC principal),
 * el alumnoId (referencia a la tabla alumno del MVC), y los datos desnormalizados del alumno
 * para mantener la independencia del microservicio.
 *
 * La tabla se crea automáticamente en colegio_db como "registro_asistencia_alumno".
 */
@Entity
@Table(name = "registro_asistencia_alumno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class RegistroAsistenciaAlumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID del alumno en la tabla 'alumno' del MVC.
     * No es FK de JPA — los servicios son independientes.
     */
    @Column(nullable = false)
    private Long alumnoId;

    /**
     * Código QR escaneado (UUID del alumno).
     * Se guarda para trazabilidad del escaneo.
     */
    @Column(nullable = false, length = 36)
    private String codigoQr;

    /* Nombre del alumno (desnormalizado para independencia del servicio) */
    @Column(nullable = false, length = 150)
    private String nombreAlumno;

    /* Grado del alumno al momento del registro (desnormalizado) */
    @Column(length = 50)
    private String grado;

    /* Sección del alumno (desnormalizado) */
    @Column(length = 10)
    private String seccion;

    /* Tipo de evento: ENTRADA o SALIDA */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEvento tipoEvento;

    /* Fecha y hora exacta del evento */
    @Column(nullable = false)
    private LocalDateTime horaEvento;

    /**
     * ID del usuario (portero/administrador) que registró la asistencia.
     * No es FK de JPA — independencia del servicio.
     */
    @Column
    private Long registradoPorId;

    /* Observaciones opcionales */
    @Column(length = 500)
    private String observaciones;
}
