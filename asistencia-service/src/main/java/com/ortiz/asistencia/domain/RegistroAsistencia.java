package com.ortiz.asistencia.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/*
 Entidad que representa un evento de asistencia del personal del colegio.

  Almacena quién registró el evento (usuarioId referencia al sistema MVC principal),
  cuándo ocurrió y si fue entrada o salida.
  La tabla se crea automáticamente en colegio_db como "registro_asistencia".
 */
@Entity
@Table(name = "registro_asistencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class RegistroAsistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     ID del usuario en el sistema principal (tabla 'usuarios' de colegio_db).
      No es una FK de JPA — los servicios son independientes.
     */
    @Column(nullable = false)
    private Long usuarioId;

    /* Nombre completo del personal (desnormalizado para independencia del servicio) */
    @Column(nullable = false, length = 150)
    private String nombrePersonal;

    /* Rol del personal al momento del registro (desnormalizado) */
    @Column(nullable = false, length = 50)
    private String rolPersonal;

    /* Tipo de evento: ENTRADA o SALIDA */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEvento tipoEvento;

    /* Fecha y hora exacta del evento */
    @Column(nullable = false)
    private LocalDateTime horaEvento;

    /* Observaciones opcionales (tardanza, justificación, etc.) */
    @Column(length = 500)
    private String observaciones;

    // ── Setters (usados por AsistenciaService) ────────────────────────────────

//    public void setUsuarioId(Long usuarioId) {
//        this.usuarioId = usuarioId;
//    }
//
//    public void setNombrePersonal(String nombrePersonal) {
//        this.nombrePersonal = nombrePersonal;
//    }
//
//    public void setRolPersonal(String rolPersonal) {
//        this.rolPersonal = rolPersonal;
//    }
//
//    public void setTipoEvento(TipoEvento tipoEvento) {
//        this.tipoEvento = tipoEvento;
//    }
//
//    public void setHoraEvento(LocalDateTime horaEvento) {
//        this.horaEvento = horaEvento;
//    }
//
//    public void setObservaciones(String observaciones) {
//        this.observaciones = observaciones;
//    }
}
