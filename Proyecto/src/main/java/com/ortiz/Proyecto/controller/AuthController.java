package com.ortiz.Proyecto.controller;

import com.ortiz.Proyecto.domain.Usuario;
import com.ortiz.Proyecto.dto.DatosLogin;
import com.ortiz.Proyecto.security.JwtUtil;
import com.ortiz.Proyecto.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controlador de autenticación.
 * POST /api/auth/login → devuelve JWT + datos del usuario si las credenciales son válidas.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody DatosLogin datos) {
        try {
            // Autenticar con Spring Security (valida usuario + contraseña encriptada)
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(datos.usuario(), datos.contraseña()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }

        // Obtener usuario completo para responder con sus datos (a través del service)
        Usuario usuario = usuarioService.buscarPorUsername(datos.usuario()).orElseThrow();

        String token = jwtUtil.generateToken(usuario.getUsuario(), usuario.getRol().name());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "id", usuario.getId(),
                "nombre", usuario.getNombre(),
                "usuario", usuario.getUsuario(),
                "rol", usuario.getRol().name()));
    }
}
