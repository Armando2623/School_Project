package com.ortiz.Proyecto.controller;

import com.ortiz.Proyecto.domain.Alumno;
import com.ortiz.Proyecto.dto.AlumnoQrResponseDto;
import com.ortiz.Proyecto.dto.DatosRegistroAlumno;
import com.ortiz.Proyecto.service.AlumnoService;
import com.ortiz.Proyecto.service.QrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    @Autowired
    private QrService qrService;

    @Autowired
    private com.ortiz.Proyecto.service.AuditoriaService auditoriaService;

    /* GET /api/alumnos — Lista todos los alumnos */
    @GetMapping
    public ResponseEntity<List<Alumno>> listar() {
        return ResponseEntity.ok(alumnoService.listar());
    }

    /* GET /api/alumnos/{id} — Obtiene un alumno por ID */
    @GetMapping("/{id}")
    public ResponseEntity<Alumno> obtener(@PathVariable Long id) {
        return alumnoService.obtener(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* POST /api/alumnos — Registra un nuevo alumno con apoderado opcional */
    @PostMapping
    public ResponseEntity<Alumno> registrar(@RequestBody @Valid DatosRegistroAlumno datos) {
        Alumno creado = alumnoService.registrar(datos);
        auditoriaService.registrarLog("CREAR_ALUMNO", "Se registró al alumno: " + creado.getNombre() + " (Código QR: " + creado.getCodigoQr() + ")");
        return ResponseEntity.ok(creado);
    }

    /* GET /api/alumnos/apoderado/{visitanteId} — Alumnos de un apoderado */
    @GetMapping("/apoderado/{visitanteId}")
    public ResponseEntity<List<Alumno>> porApoderado(@PathVariable Long visitanteId) {
        return ResponseEntity.ok(alumnoService.listarPorApoderado(visitanteId));
    }

    /* PUT /api/alumnos/{id} — Actualiza un alumno existente */
    @PutMapping("/{id}")
    public ResponseEntity<Alumno> actualizar(@PathVariable Long id,
            @RequestBody @Valid DatosRegistroAlumno datos) {
        Alumno actualizado = alumnoService.actualizar(id, datos);
        auditoriaService.registrarLog("ACTUALIZAR_ALUMNO", "Se actualizó al alumno ID: " + id + " (" + actualizado.getNombre() + ")");
        return ResponseEntity.ok(actualizado);
    }

    /**
     * GET /api/alumnos/{id}/qr
     * Retorna la imagen PNG del código QR del alumno para descarga o visualización.
     * Accesible por todos los roles autenticados.
     */
    @GetMapping(value = "/{id}/qr", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> obtenerQr(@PathVariable Long id) {
        var alumnoOpt = alumnoService.obtener(id);
        if (alumnoOpt.isEmpty() || alumnoOpt.get().getCodigoQr() == null) {
            return ResponseEntity.notFound().build();
        }
        byte[] imagen = qrService.generarQrPng(alumnoOpt.get().getCodigoQr());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"qr-alumno-" + id + ".png\"")
                .body(imagen);
    }

    /**
     * GET /api/alumnos/qr/{codigoQr}
     * Valida un código QR y retorna los datos del alumno más la información de contacto
     * del apoderado (email, nombre, teléfono) para que el microservicio de asistencia
     * pueda enviar notificaciones al padre/madre al registrar la asistencia del alumno.
     */
    @GetMapping("/qr/{codigoQr}")
    public ResponseEntity<AlumnoQrResponseDto> buscarPorQr(@PathVariable String codigoQr) {
        return alumnoService.buscarPorCodigoQr(codigoQr)
                .map(alumno -> {
                    var apoderado = alumno.getApoderado();
                    return ResponseEntity.ok(new AlumnoQrResponseDto(
                            alumno.getId(),
                            alumno.getNombre(),
                            alumno.getGrado(),
                            alumno.getSeccion(),
                            alumno.getCodigoQr(),
                            apoderado != null ? apoderado.getEmail()           : null,
                            apoderado != null ? apoderado.getNombreVisitante() : null,
                            apoderado != null ? apoderado.getTelefono()        : null
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

