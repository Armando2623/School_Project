package com.ortiz.Proyecto.controller;

import com.ortiz.Proyecto.domain.AuditoriaLog;
import com.ortiz.Proyecto.dto.DatosRegistroAuditoria;
import com.ortiz.Proyecto.service.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {

    @Autowired
    private AuditoriaService service;

    @GetMapping
    public ResponseEntity<List<AuditoriaLog>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping
    public ResponseEntity<AuditoriaLog> registrar(@RequestBody DatosRegistroAuditoria datos) {
        AuditoriaLog log = service.registrarLog(datos.getUsuario(), datos.getRol(), datos.getAccion(), datos.getDetalles());
        return ResponseEntity.ok(log);
    }
}
