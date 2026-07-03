package com.ortiz.Proyecto.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
  Entidad que representa un registro de visita al colegio.
  La relación con Usuario se resuelve en la capa de servicio (RegistroService),
  manteniendo el dominio desacoplado de los DTOs.
 */
@Entity(name = "RegistroVisita")
@Table(name = "registro_visita")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class RegistroVisita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreVisitante;

    private String dniVisitante;

    private String motivo;

    private LocalDateTime horaIngreso;

    @Enumerated(EnumType.STRING)
    private EstadoRegistro estadoRegistro;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // ── Setters (usados por RegistroService) ──────────────────────────────────

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombreVisitante(String nombreVisitante) {
        this.nombreVisitante = nombreVisitante;
    }

    public void setDniVisitante(String dniVisitante) {
        this.dniVisitante = dniVisitante;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public void setHoraIngreso(LocalDateTime horaIngreso) {
        this.horaIngreso = horaIngreso;
    }

    public void setEstadoRegistro(EstadoRegistro estadoRegistro) {
        this.estadoRegistro = estadoRegistro;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
