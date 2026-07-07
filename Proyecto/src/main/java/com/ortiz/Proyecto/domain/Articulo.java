package com.ortiz.Proyecto.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articulo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Articulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "codigo_barras", unique = true, nullable = false)
    private String codigoBarras;

    private String estado; // E.g., EXCELENTE, BUENO, REGULAR, DETERIORADO, EN_MANTENIMIENTO

    @Column(nullable = false)
    private Integer cantidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Area area;

    @OneToMany(mappedBy = "articulo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("articulo")
    private List<ArticuloFoto> fotos = new ArrayList<>();

    // Constructor de conveniencia sin ID
    public Articulo(String nombre, String descripcion, String codigoBarras, String estado, Integer cantidad, Area area) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigoBarras = codigoBarras;
        this.estado = estado;
        this.cantidad = cantidad;
        this.area = area;
    }
}
