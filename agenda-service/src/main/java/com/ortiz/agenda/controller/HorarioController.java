package com.ortiz.agenda.controller;

import com.ortiz.agenda.domain.DiaSemana;
import com.ortiz.agenda.domain.HorarioSemanal;
import com.ortiz.agenda.dto.DatosHorarioSemanal;
import com.ortiz.agenda.service.HorarioService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para los horarios semanales de los profesores.
 *
 * Base URL: http://localhost:8082/api/horarios
 *
 * Endpoints:
 *   POST   /api/horarios                          → Crear bloque horario
 *   GET    /api/horarios                          → Listar horarios activos
 *   GET    /api/horarios/todos                    → Listar todos (activos + inactivos)
 *   GET    /api/horarios/{id}                     → Obtener por ID
 *   PUT    /api/horarios/{id}                     → Actualizar bloque
 *   DELETE /api/horarios/{id}                     → Eliminar bloque
 *   GET    /api/horarios/profesor/{profesorId}    → Horario de un profesor
 *   GET    /api/horarios/dia/{diaSemana}          → Horarios de un día de la semana
 */
@RestController
@RequestMapping("/api/horarios")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @Autowired
    private com.ortiz.agenda.service.AuditoriaService auditoriaService;

    /**
     * Crea un nuevo bloque de horario semanal.
     * Roles: ADMINISTRADOR, DIRECTOR
     */
    @PostMapping
    public ResponseEntity<HorarioSemanal> crear(
            @Valid @RequestBody DatosHorarioSemanal datos) {
        HorarioSemanal creado = horarioService.crear(datos);
        auditoriaService.registrarLog("CREAR_HORARIO_SEMANAL", "Se creó bloque horario semanal: " + creado.getMateria() + " (Profesor ID: " + creado.getProfesorId() + ", Día: " + creado.getDiaSemana() + ", " + creado.getHoraInicio() + " - " + creado.getHoraFin() + ")");
        return ResponseEntity.ok(creado);
    }

    /**
     * Lista todos los bloques de horario activos (vista general vigente del colegio).
     */
    @GetMapping
    public ResponseEntity<List<HorarioSemanal>> listarActivos() {
        return ResponseEntity.ok(horarioService.listarActivos());
    }

    /**
     * Lista todos los bloques de horario, incluyendo inactivos.
     */
    @GetMapping("/todos")
    public ResponseEntity<List<HorarioSemanal>> listarTodos() {
        return ResponseEntity.ok(horarioService.listarTodos());
    }

    /**
     * Obtiene un bloque de horario por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HorarioSemanal> obtenerPorId(@PathVariable Long id) {
        return horarioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Actualiza un bloque de horario existente.
     * Roles: ADMINISTRADOR, DIRECTOR
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody DatosHorarioSemanal datos) {
        try {
            HorarioSemanal act = horarioService.actualizar(id, datos);
            auditoriaService.registrarLog("ACTUALIZAR_HORARIO_SEMANAL", "Se actualizó bloque horario semanal ID: " + id + " (Profesor ID: " + act.getProfesorId() + ", Materia: " + act.getMateria() + ")");
            return ResponseEntity.ok(act);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Elimina un bloque de horario.
     * Roles: ADMINISTRADOR, DIRECTOR
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            horarioService.eliminar(id);
            auditoriaService.registrarLog("ELIMINAR_HORARIO_SEMANAL", "Se eliminó bloque horario semanal ID: " + id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lista todos los bloques de horario de un profesor, ordenados por día y hora.
     * Ejemplo: GET /api/horarios/profesor/1
     */
    @GetMapping("/profesor/{profesorId}")
    public ResponseEntity<List<HorarioSemanal>> listarPorProfesor(
            @PathVariable Long profesorId) {
        return ResponseEntity.ok(horarioService.listarPorProfesor(profesorId));
    }

    /**
     * Lista solo los bloques activos de un profesor.
     * Ejemplo: GET /api/horarios/profesor/1/activos
     */
    @GetMapping("/profesor/{profesorId}/activos")
    public ResponseEntity<List<HorarioSemanal>> listarActivosPorProfesor(
            @PathVariable Long profesorId) {
        return ResponseEntity.ok(horarioService.listarActivosPorProfesor(profesorId));
    }

    /**
     * Lista todos los bloques de un día de la semana.
     * Ejemplo: GET /api/horarios/dia/LUNES
     */
    @GetMapping("/dia/{diaSemana}")
    public ResponseEntity<List<HorarioSemanal>> listarPorDia(
            @PathVariable DiaSemana diaSemana) {
        return ResponseEntity.ok(horarioService.listarPorDia(diaSemana));
    }

    /**
     * Lista los bloques activos de un día de la semana.
     * Ejemplo: GET /api/horarios/dia/LUNES/activos
     */
    @GetMapping("/dia/{diaSemana}/activos")
    public ResponseEntity<List<HorarioSemanal>> listarActivosPorDia(
            @PathVariable DiaSemana diaSemana) {
        return ResponseEntity.ok(horarioService.listarActivosPorDia(diaSemana));
    }
}
