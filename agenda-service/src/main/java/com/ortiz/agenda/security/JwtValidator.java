package com.ortiz.agenda.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

/**
 * Validador de JWT para el microservicio de agenda.
 *
 * Usa el mismo secret que el MVC principal (SchoolGuard) y que asistencia-service
 * para verificar que el token fue emitido por el sistema central.
 * NO genera nuevos tokens — solo valida los existentes.
 */
@Component
public class JwtValidator {

    @Value("${jwt.secret}")
    private String secret;

    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /** Verifica firma y vigencia del token */
    public boolean isValid(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("[JwtValidator] JWT validation failed: " + e.getMessage());
            return false;
        }
    }

    /** Extrae el username (subject) del token */
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    /** Extrae el rol embebido en el token */
    public String extractRol(String token) {
        return (String) getClaims(token).get("rol");
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
