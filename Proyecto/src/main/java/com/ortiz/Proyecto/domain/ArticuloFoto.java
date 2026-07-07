package com.ortiz.Proyecto.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "articulo_foto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class ArticuloFoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "foto_base64", columnDefinition = "LONGTEXT", nullable = false)
    private String fotoBase64;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "articulo_id", nullable = false)
    @JsonIgnoreProperties("fotos")
    private Articulo articulo;

    public ArticuloFoto(String fotoBase64, Articulo articulo) {
        this.fotoBase64 = fotoBase64;
        this.articulo = articulo;
    }
}
