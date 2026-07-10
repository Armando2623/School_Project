package com.ortiz.Proyecto.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/*
  Intercepta cada petición HTTP, extrae el JWT del header Authorization
  y carga el usuario autenticado en el SecurityContext de Spring.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // Si no hay header o no empieza con "Bearer ", continuar sin autenticar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        if (!jwtUtil.isValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String username = jwtUtil.extractUsername(token);

        // Solo autenticar si aún no hay un usuario en el contexto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (Exception e) {
                // Si la BD falla o el usuario no existe, registrar el error real
                // en vez de devolver un 401 silencioso
                System.err.println("[JwtFilter] Error al cargar usuario '" + username + "': " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Si la ruta es de Swagger o OpenAPI, retornar TRUE para que NO se filtre
        return path.startsWith("/swagger-ui/") || path.startsWith("/v3/api-docs") || path.equals("/swagger-ui.html");
    }
}
