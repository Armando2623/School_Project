package com.ortiz.asistencia.controller;

import com.ortiz.asistencia.domain.RegistroAsistenciaAlumno;
import com.ortiz.asistencia.dto.DatosRegistroAsistenciaAlumno;
import com.ortiz.asistencia.service.AsistenciaAlumnoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador REST para el registro de asistencia de alumnos via QR.
 *
 * Base URL: http://localhost:8081/api/asistencia/alumnos
 *
 * Endpoints:
 *   POST   /api/asistencia/alumnos                            → Registrar asistencia por QR
 *   GET    /api/asistencia/alumnos                            → Listar todos los registros
 *   GET    /api/asistencia/alumnos/{id}                       → Obtener registro por ID
 *   GET    /api/asistencia/alumnos/alumno/{alumnoId}          → Historial de un alumno
 *   GET    /api/asistencia/alumnos/fecha?fecha=YYYY-MM-DD     → Registros de una fecha
 *   GET    /api/asistencia/alumnos/alumno/{id}/fecha?fecha=   → Alumno en una fecha
 *   GET    /api/asistencia/alumnos/grado/{grado}/fecha?fecha= → Por grado y fecha
 */
@RestController
@RequestMapping("/api/asistencia/alumnos")
public class AsistenciaAlumnoController {

    @Autowired
    private AsistenciaAlumnoService service;

    /**
     * Registra un nuevo evento de asistencia de un alumno via QR.
     * El QR es validado consultando el MVC en /api/alumnos/qr/{codigoQr}.
     * Requiere rol: ADMINISTRADOR, PORTERO o SECRETARIA.
     */
    @PostMapping
    public ResponseEntity<?> registrar(
            @Valid @RequestBody DatosRegistroAsistenciaAlumno datos,
            HttpServletRequest request) {
        try {
            // Extraer JWT para pasarlo al MVC al validar el QR
            String authHeader = request.getHeader("Authorization");
            String token = (authHeader != null && authHeader.startsWith("Bearer "))
                    ? authHeader.substring(7)
                    : null;

            RegistroAsistenciaAlumno registro = service.registrar(datos, token);
            return ResponseEntity.ok(registro);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    /**
     * Lista todos los registros de asistencia de alumnos.
     */
    @GetMapping
    public ResponseEntity<List<RegistroAsistenciaAlumno>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    /**
     * Obtiene un registro por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RegistroAsistenciaAlumno> obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Historial de asistencia de un alumno (por alumnoId del MVC).
     */
    @GetMapping("/alumno/{alumnoId}")
    public ResponseEntity<List<RegistroAsistenciaAlumno>> listarPorAlumno(
            @PathVariable Long alumnoId) {
        return ResponseEntity.ok(service.listarPorAlumno(alumnoId));
    }

    /**
     * Registros de una fecha específica.
     * Ejemplo: GET /api/asistencia/alumnos/fecha?fecha=2026-06-24
     */
    @GetMapping("/fecha")
    public ResponseEntity<List<RegistroAsistenciaAlumno>> listarPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(service.listarPorFecha(fecha));
    }

    /**
     * Registros de un alumno en una fecha específica.
     */
    @GetMapping("/alumno/{alumnoId}/fecha")
    public ResponseEntity<List<RegistroAsistenciaAlumno>> listarPorAlumnoYFecha(
            @PathVariable Long alumnoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(service.listarPorAlumnoYFecha(alumnoId, fecha));
    }

    /**
     * Registros de un grado completo en una fecha específica.
     * Ejemplo: GET /api/asistencia/alumnos/grado/3°%20Primaria/fecha?fecha=2026-06-24
     */
    @GetMapping("/grado/{grado}/fecha")
    public ResponseEntity<List<RegistroAsistenciaAlumno>> listarPorGradoYFecha(
            @PathVariable String grado,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(service.listarPorGradoYFecha(grado, fecha));
    }
}
