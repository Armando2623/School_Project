package com.ortiz.asistencia.config;

import com.ortiz.asistencia.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuración de seguridad del microservicio de asistencia.
 *
 * Política: sin sesión (STATELESS), validación de JWT en cada request.
 * Roles permitidos alineados con el sistema principal SchoolGuard.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsSource()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // ─── Content-Security-Policy y demás security headers ──────────────────────
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp.policyDirectives(
                                "default-src 'self'; " +
                                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                                "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
                                "img-src 'self' data:; " +
                                "connect-src 'self' https://school-project-1mso.onrender.com; " +
                                "object-src 'none'; " +
                                "base-uri 'self'; " +
                                "form-action 'self'"
                        ))
                        .frameOptions(frame -> frame.deny())
                        .contentTypeOptions(ct -> {})
                )

                .authorizeHttpRequests(auth -> auth

                        // ─── Registrar asistencia personal: PORTERO, SECRETARIA, ADMINISTRADOR ──
                        .requestMatchers(HttpMethod.POST, "/api/asistencia")
                        .hasAnyRole("ADMINISTRADOR", "PORTERO", "SECRETARIA")

                        // ─── Registrar asistencia alumno via QR: PORTERO, SECRETARIA, ADMINISTRADOR
                        .requestMatchers(HttpMethod.POST, "/api/asistencia/alumnos")
                        .hasAnyRole("ADMINISTRADOR", "PORTERO", "SECRETARIA")

                        // ─── Consultar asistencia personal: todos los roles autenticados ─────────
                        .requestMatchers(HttpMethod.GET, "/api/asistencia/**")
                        .hasAnyRole("ADMINISTRADOR", "DIRECTOR", "SECRETARIA", "PORTERO", "PROFESOR")

                        // ─── Swagger y OpenAPI: público ──────────────────────────────────────────
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/webjars/**"
                        ).permitAll()

                        // ─── Cualquier otra petición requiere autenticación ──────────────────
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        // Devuelve 401 cuando no hay token o es inválido (en vez de 403)
                        .authenticationEntryPoint((req, res, e) -> res.sendError(401, "No autenticado"))
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsSource() {
        CorsConfiguration config = new CorsConfiguration();
        // ─── Orígenes permitidos: frontend local (dev) + Render (prod) ────────────
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:[*]",
                "https://schoolguard-frontend.onrender.com",
                "https://school-project-1mso.onrender.com"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Sólo los headers que realmente se usan
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
