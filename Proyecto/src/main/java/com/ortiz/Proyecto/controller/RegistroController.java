package com.ortiz.Proyecto.controller;

import com.ortiz.Proyecto.domain.RegistroVisita;
import com.ortiz.Proyecto.domain.Usuario;
import com.ortiz.Proyecto.dto.DatosRegistroVisita;
import com.ortiz.Proyecto.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitas")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    @Autowired
    private com.ortiz.Proyecto.service.AuditoriaService auditoriaService;

    /* POST /api/visitas — Registra una nueva visita */
    @PostMapping
    public ResponseEntity<RegistroVisita> registrarVisita(@RequestBody DatosRegistroVisita datosRegistro) {
        RegistroVisita rv = registroService.registrar(datosRegistro);
        auditoriaService.registrarLog("REGISTRAR_INGRESO_VISITA", "Se registró ingreso de visitante: " + rv.getNombreVisitante() + " (Motivo: " + rv.getMotivo() + ", Destino: " + (rv.getUsuario() != null ? rv.getUsuario().getNombre() : "N/A") + ")");
        return ResponseEntity.ok(rv);
    }

    /* GET /api/visitas — Lista todas las visitas con usuario */
    @GetMapping
    public ResponseEntity<List<RegistroVisita>> listarVisitas() {
        return ResponseEntity.ok(registroService.listar());
    }

    /* GET /api/visitas/usuarios?search= — Autocompletado de "Persona a Visitar" */
    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> buscarUsuarios(@RequestParam String search) {
        return ResponseEntity.ok(registroService.buscarUsuarios(search));
    }

    /*
     GET /api/visitas/visitante?dni= — Busca el último registro con ese DNI
     (usado como fallback antes de crear la entidad Visitante)
     */
    @GetMapping("/visitante")
    public ResponseEntity<?> buscarVisitantePorDni(@RequestParam String dni) {
        return registroService.buscarPorDni(dni)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* PUT /api/visitas/{id} — Actualiza una visita existente */
    @PutMapping("/{id}")
    public ResponseEntity<RegistroVisita> actualizar(@PathVariable Long id,
            @RequestBody DatosRegistroVisita datos) {
        RegistroVisita rv = registroService.actualizar(id, datos);
        auditoriaService.registrarLog("REGISTRAR_SALIDA_VISITA", "Se registró salida de visitante: " + rv.getNombreVisitante());
        return ResponseEntity.ok(rv);
    }
}
