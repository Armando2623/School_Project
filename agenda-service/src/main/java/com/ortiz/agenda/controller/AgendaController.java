package com.ortiz.agenda.controller;

import com.ortiz.agenda.domain.AgendaProfesor;
import com.ortiz.agenda.domain.DiaSemana;
import com.ortiz.agenda.domain.EstadoAgenda;
import com.ortiz.agenda.dto.DatosAgendaProfesor;
import com.ortiz.agenda.service.AgendaService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador REST para la agenda de los profesores.
 *
 * Base URL: http://localhost:8082/api/agenda
 *
 * Endpoints:
 *   POST   /api/agenda                                          → Crear evento
 *   GET    /api/agenda                                          → Listar todos
 *   GET    /api/agenda/{id}                                     → Obtener por ID
 *   PUT    /api/agenda/{id}                                     → Actualizar evento
 *   DELETE /api/agenda/{id}                                     → Eliminar evento
 *   GET    /api/agenda/profesor/{profesorId}                    → Agenda de un profesor
 *   GET    /api/agenda/profesor/{profesorId}/estado/{estado}    → Filtrar por estado
 *   GET    /api/agenda/fecha?fecha=YYYY-MM-DD                   → Agenda de una fecha
 *   GET    /api/agenda/profesor/{profesorId}/fecha?fecha=YYYY-MM-DD → Agenda profesor/fecha
 *   GET    /api/agenda/recurrentes/{diaSemana}                  → Eventos recurrentes por día
 */
@RestController
@RequestMapping("/api/agenda")
public class AgendaController {

    @Autowired
    private AgendaService agendaService;

    @Autowired
    private com.ortiz.agenda.service.AuditoriaService auditoriaService;

    /**
     * Crea un nuevo evento en la agenda de un profesor.
     * Roles: ADMINISTRADOR, DIRECTOR, PROFESOR
     */
    @PostMapping
    public ResponseEntity<AgendaProfesor> crear(
            @Valid @RequestBody DatosAgendaProfesor datos) {
        AgendaProfesor creado = agendaService.crear(datos);
        auditoriaService.registrarLog("CREAR_EVENTO_AGENDA", "Se creó evento: " + creado.getTitulo() + " (Profesor ID: " + creado.getProfesorId() + ", Fecha: " + creado.getFechaInicio() + ")");
        return ResponseEntity.ok(creado);
    }

    /**
     * Lista todos los eventos de agenda, ordenados por fecha de inicio.
     */
    @GetMapping
    public ResponseEntity<List<AgendaProfesor>> listarTodos() {
        return ResponseEntity.ok(agendaService.listarTodos());
    }

    /**
     * Obtiene un evento de agenda por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AgendaProfesor> obtenerPorId(@PathVariable Long id) {
        return agendaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Actualiza un evento existente en la agenda.
     * Roles: ADMINISTRADOR, DIRECTOR, PROFESOR
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody DatosAgendaProfesor datos) {
        try {
            AgendaProfesor act = agendaService.actualizar(id, datos);
            auditoriaService.registrarLog("ACTUALIZAR_EVENTO_AGENDA", "Se actualizó evento ID: " + id + " (Profesor ID: " + act.getProfesorId() + ", Título: " + act.getTitulo() + ")");
            return ResponseEntity.ok(act);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Elimina un evento de la agenda.
     * Roles: ADMINISTRADOR, DIRECTOR
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            agendaService.eliminar(id);
            auditoriaService.registrarLog("ELIMINAR_EVENTO_AGENDA", "Se eliminó evento ID: " + id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lista todos los eventos de agenda de un profesor específico.
     * Ejemplo: GET /api/agenda/profesor/1
     */
    @GetMapping("/profesor/{profesorId}")
    public ResponseEntity<List<AgendaProfesor>> listarPorProfesor(
            @PathVariable Long profesorId) {
        return ResponseEntity.ok(agendaService.listarPorProfesor(profesorId));
    }

    /**
     * Lista los eventos de un profesor filtrados por estado.
     * Ejemplo: GET /api/agenda/profesor/1/estado/ACTIVO
     */
    @GetMapping("/profesor/{profesorId}/estado/{estado}")
    public ResponseEntity<List<AgendaProfesor>> listarPorProfesorYEstado(
            @PathVariable Long profesorId,
            @PathVariable EstadoAgenda estado) {
        return ResponseEntity.ok(agendaService.listarPorProfesorYEstado(profesorId, estado));
    }

    /**
     * Lista todos los eventos de una fecha específica.
     * Ejemplo: GET /api/agenda/fecha?fecha=2026-06-25
     */
    @GetMapping("/fecha")
    public ResponseEntity<List<AgendaProfesor>> listarPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(agendaService.listarPorFecha(fecha));
    }

    /**
     * Lista los eventos de un profesor en una fecha específica.
     * Ejemplo: GET /api/agenda/profesor/1/fecha?fecha=2026-06-25
     */
    @GetMapping("/profesor/{profesorId}/fecha")
    public ResponseEntity<List<AgendaProfesor>> listarPorProfesorYFecha(
            @PathVariable Long profesorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(agendaService.listarPorProfesorYFecha(profesorId, fecha));
    }

    /**
     * Lista los eventos recurrentes de un día de la semana.
     * Ejemplo: GET /api/agenda/recurrentes/LUNES
     */
    @GetMapping("/recurrentes/{diaSemana}")
    public ResponseEntity<List<AgendaProfesor>> listarRecurrentesPorDia(
            @PathVariable DiaSemana diaSemana) {
        return ResponseEntity.ok(agendaService.listarRecurrentesPorDia(diaSemana));
    }
}
