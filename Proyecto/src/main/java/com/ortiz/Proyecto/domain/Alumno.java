package com.ortiz.Proyecto.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "alumno")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String grado;

    private String seccion;

    /**
     * Código QR único del alumno (UUID generado automáticamente al registrar).
     * Se usa para identificar al alumno en el sistema de asistencia.
     */
    @Column(name = "codigo_qr", unique = true, length = 36)
    private String codigoQr;

    /**
     * Apoderado (padre/madre/tutor) del alumno.
     * Nullable para no romper alumnos ya existentes que no tienen apoderado asignado.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visitante_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Visitante apoderado;

    // Constructor de conveniencia sin apoderado (compatibilidad hacia atrás)
    public Alumno(String nombre, String grado, String seccion) {
        this.nombre = nombre;
        this.grado = grado;
        this.seccion = seccion;
    }

    // Constructor con apoderado
    public Alumno(String nombre, String grado, String seccion, Visitante apoderado) {
        this.nombre = nombre;
        this.grado = grado;
        this.seccion = seccion;
        this.apoderado = apoderado;
    }

    public void setApoderado(Visitante apoderado) {
        this.apoderado = apoderado;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setGrado(String grado) {
        this.grado = grado;
    }

    public void setSeccion(String seccion) {
        this.seccion = seccion;
    }

    public void setCodigoQr(String codigoQr) {
        this.codigoQr = codigoQr;
    }
}
