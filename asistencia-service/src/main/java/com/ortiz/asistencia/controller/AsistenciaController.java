package com.ortiz.asistencia.controller;

import com.ortiz.asistencia.domain.RegistroAsistencia;
import com.ortiz.asistencia.dto.DatosRegistroAsistencia;
import com.ortiz.asistencia.service.AsistenciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/*
  Controlador REST del microservicio de asistencia del personal.

  Base URL: http://localhost:8081/api/asistencia

 Endpoints disponibles:

  POST   /api/asistencia                            → Registrar evento (ENTRADA o SALIDA)
  GET    /api/asistencia                            → Listar todos los registros
  GET    /api/asistencia/{id}                       → Obtener registro por ID
  GET    /api/asistencia/personal/{usuarioId}       → Historial de un miembro del personal
  GET    /api/asistencia/fecha?fecha=YYYY-MM-DD     → Registros de una fecha específica
  GET    /api/asistencia/personal/{usuarioId}/fecha?fecha=YYYY-MM-DD → Registros de un personal en una fecha
 */
@RestController
@RequestMapping("/api/asistencia")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;

    /*
      Registra un nuevo evento de asistencia (entrada o salida) del personal.
      Requiere rol: ADMINISTRADOR, PORTERO o SECRETARIA.
     */
    @PostMapping
    public ResponseEntity<RegistroAsistencia> registrar(
            @Valid @RequestBody DatosRegistroAsistencia datos) {
        return ResponseEntity.ok(asistenciaService.registrar(datos));
    }

    /*
      Lista todos los registros de asistencia.
      Accesible por todos los roles autenticados.
     */
    @GetMapping
    public ResponseEntity<List<RegistroAsistencia>> listarTodos() {
        return ResponseEntity.ok(asistenciaService.listarTodos());
    }

    /*
      Obtiene un registro de asistencia por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RegistroAsistencia> obtenerPorId(@PathVariable Long id) {
        return asistenciaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /*
      Obtiene el historial de asistencia de un miembro del personal.
      El usuarioId corresponde al ID en la tabla 'usuarios' del MVC principal.
     */
    @GetMapping("/personal/{usuarioId}")
    public ResponseEntity<List<RegistroAsistencia>> listarPorPersonal(
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(asistenciaService.listarPorPersonal(usuarioId));
    }

    /*
      Lista todos los registros de una fecha específica.
      Ejemplo: GET /api/asistencia/fecha?fecha=2026-05-14
     */
    @GetMapping("/fecha")
    public ResponseEntity<List<RegistroAsistencia>> listarPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(asistenciaService.listarPorFecha(fecha));
    }

    /*
      Lista los registros de un miembro del personal en una fecha específica.
      Ejemplo: GET /api/asistencia/personal/3/fecha?fecha=2026-05-14
     */
    @GetMapping("/personal/{usuarioId}/fecha")
    public ResponseEntity<List<RegistroAsistencia>> listarPorPersonalYFecha(
            @PathVariable Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(asistenciaService.listarPorPersonalYFecha(usuarioId, fecha));
    }
}
