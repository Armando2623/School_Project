package com.ortiz.Proyecto.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/*
  Utilidad para generar, validar y extraer datos de tokens JWT.
 Los tokens expiran en 8 horas (ajustable).
 */
@Component
public class JwtUtil {

    // Clave secreta de al menos 256 bits recomendada para HS256
    //se agrego esto
    @Value("${jwt.secret}")
    
    private String SECRET;
    private static final long EXPIRATION_MS = 8 * 60 * 60 * 1000L; // 8 horas

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    /* Genera un JWT con el username y el rol del usuario */
    public String generateToken(String username, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /* Extrae el username (subject) del token */
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    /* Extrae el rol del token */
    public String extractRol(String token) {
        return (String) getClaims(token).get("rol");
    }

    /* Verifica que el token no haya expirado y sea válido */
    public boolean isValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
