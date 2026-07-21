package com.ortiz.agenda.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filtro JWT para el microservicio de agenda.
 * Extrae el token Bearer del header Authorization, lo valida con el mismo
 * secret del MVC principal y carga la autenticación en el SecurityContext
 * para que Spring Security autorice la solicitud.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtValidator jwtValidator;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String uri = request.getRequestURI();
        System.out.println("[JwtAuthFilter] Intercepted request to: " + uri);
        if (authHeader != null) {
            System.out.println("[JwtAuthFilter] Authorization header found: " + authHeader);
        } else {
            System.out.println("[JwtAuthFilter] No Authorization header found");
        }

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("[JwtAuthFilter] Extracted token: " + token);

            boolean valid = jwtValidator.isValid(token);
            System.out.println("[JwtAuthFilter] Token validation result: " + valid);

            if (valid) {
                String username = jwtValidator.extractUsername(token);
                String rol      = jwtValidator.extractRol(token);
                System.out.println("[JwtAuthFilter] Token claims - Username: " + username + ", Role: " + rol);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + rol))
                        );

                SecurityContextHolder.getContext().setAuthentication(auth);
                System.out.println("[JwtAuthFilter] Authentication set in SecurityContextHolder");
            }
        }

        chain.doFilter(request, response);
    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Si la ruta es de Swagger o OpenAPI, retornar TRUE para que NO se filtre
        return path.startsWith("/swagger-ui/") || path.startsWith("/v3/api-docs") || path.equals("/swagger-ui.html");
    }
}
