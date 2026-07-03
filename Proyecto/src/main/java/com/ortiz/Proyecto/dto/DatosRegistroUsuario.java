package com.ortiz.Proyecto.dto;

import com.ortiz.Proyecto.domain.Rol;

/**
 * DTO para registrar un nuevo usuario del sistema.
 * Todos los campos son requeridos.
 */
public record DatosRegistroUsuario(
        String nombre,
        String usuario,
        String contraseña,
        Rol rol) {
}
