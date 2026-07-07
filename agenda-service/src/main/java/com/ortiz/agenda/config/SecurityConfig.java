package com.ortiz.agenda.config;

import com.ortiz.agenda.security.JwtAuthFilter;
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
 * Configuración de seguridad del microservicio de agenda.
 *
 * Política: sin sesión (STATELESS), validación de JWT en cada request.
 *
 * Reglas de acceso:
 *  - Crear/actualizar/eliminar agenda  → ADMINISTRADOR, DIRECTOR, PROFESOR
 *  - Crear/actualizar/eliminar horario → ADMINISTRADOR, DIRECTOR
 *  - Consultar agenda y horarios       → todos los roles autenticados
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

                        // ─── Agenda: escritura ────────────────────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/api/agenda")
                            .hasAnyRole("ADMINISTRADOR", "DIRECTOR", "PROFESOR")
                        .requestMatchers(HttpMethod.PUT, "/api/agenda/**")
                            .hasAnyRole("ADMINISTRADOR", "DIRECTOR", "PROFESOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/agenda/**")
                            .hasAnyRole("ADMINISTRADOR", "DIRECTOR")

                        // ─── Horarios: escritura ─────────────────────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/api/horarios")
                            .hasAnyRole("ADMINISTRADOR", "DIRECTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/horarios/**")
                            .hasAnyRole("ADMINISTRADOR", "DIRECTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/horarios/**")
                            .hasAnyRole("ADMINISTRADOR", "DIRECTOR")

                        // ─── Consultas: todos los roles autenticados ─────────────────────────
                        .requestMatchers(HttpMethod.GET, "/api/agenda/**")
                            .hasAnyRole("ADMINISTRADOR", "DIRECTOR", "SECRETARIA", "PORTERO", "PROFESOR")
                        .requestMatchers(HttpMethod.GET, "/api/horarios/**")
                            .hasAnyRole("ADMINISTRADOR", "DIRECTOR", "SECRETARIA", "PORTERO", "PROFESOR")

                        // ─── Swagger y OpenAPI: público ────────────────────────────────────────────
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/webjars/**"
                        ).permitAll()

                        // ─── Cualquier otra petición requiere autenticación ─────────────────────
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
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
