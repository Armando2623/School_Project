package com.ortiz.Proyecto.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String usuario;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    // ── Getters ───────────────────────────────────────────────
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getUsuario() {
        return usuario;
    }

    public String getContraseña() {
        return password;
    }

    public Rol getRol() {
        return rol;
    }

    // ── Setters (necesarios para DataInitializer y futuras actualizaciones) ──
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public void setContraseña(String contraseña) {
        this.password = contraseña;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
