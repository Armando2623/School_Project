package com.ortiz.Proyecto.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "area")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String tipo; // E.g., AULA, LABORATORIO, ADMINISTRATIVO, OTROS

    private String descripcion;

    // Constructor de conveniencia sin ID
    public Area(String nombre, String tipo, String descripcion) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.descripcion = descripcion;
    }
}
