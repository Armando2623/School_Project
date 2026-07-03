package com.ortiz.Proyecto.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/*
  Representa a cualquier persona externa al colegio que realiza una visita:
  padres de familia, proveedores, otros visitantes.
 */
@Entity
@Table(name = "visitante")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Visitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String dniVisitante;

    @Column(nullable = false)
    private String nombreVisitante;

    private String telefono;

    private String email;

    /**
     * Alumnos que este visitante tiene como apoderado.
     * Un padre puede tener más de un hijo en el colegio.
     */
    @OneToMany(mappedBy = "apoderado", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Evita ciclo infinito en serialización JSON
    private List<Alumno> hijos = new ArrayList<>();

    // Constructor de conveniencia (sin id ni hijos)
    public Visitante(String dniVisitante, String nombreVisitante, String telefono, String email) {
        this.dniVisitante = dniVisitante;
        this.nombreVisitante = nombreVisitante;
        this.telefono = telefono;
        this.email = email;
    }
}
