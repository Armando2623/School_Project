package com.ortiz.Proyecto.dto;

/**
 * DTO recibido en POST /api/auth/login
 */
public record DatosLogin(String usuario, String contraseña) {
}
