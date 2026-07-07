package com.ortiz.Proyecto.controller;

import com.ortiz.Proyecto.domain.Area;
import com.ortiz.Proyecto.domain.Articulo;
import com.ortiz.Proyecto.dto.DatosRegistroArea;
import com.ortiz.Proyecto.dto.DatosRegistroArticulo;
import com.ortiz.Proyecto.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @Autowired
    private com.ortiz.Proyecto.service.QrService qrService;

    @GetMapping(value = "/articulos/{id}/barcode", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> obtenerBarcode(@PathVariable Long id) {
        var articuloOpt = inventarioService.obtenerArticulo(id);
        if (articuloOpt.isEmpty() || articuloOpt.get().getCodigoBarras() == null) {
            return ResponseEntity.notFound().build();
        }
        byte[] imagen = qrService.generarBarcodePng(articuloOpt.get().getCodigoBarras());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"barcode-articulo-" + id + ".png\"")
                .body(imagen);
    }

    // --- Endpoints de Áreas/Aulas ---

    @GetMapping("/areas")
    public ResponseEntity<List<Area>> listarAreas() {
        return ResponseEntity.ok(inventarioService.listarAreas());
    }

    @PostMapping("/areas")
    public ResponseEntity<Area> registrarArea(@RequestBody @Valid DatosRegistroArea datos) {
        return ResponseEntity.ok(inventarioService.registrarArea(datos));
    }

    // --- Endpoints de Artículos ---

    @GetMapping("/articulos")
    public ResponseEntity<List<Articulo>> listarArticulos(@RequestParam(required = false) Long areaId) {
        return ResponseEntity.ok(inventarioService.listarArticulos(areaId));
    }

    @PostMapping("/articulos")
    public ResponseEntity<Articulo> registrarArticulo(@RequestBody @Valid DatosRegistroArticulo datos) {
        return ResponseEntity.ok(inventarioService.registrarArticulo(datos));
    }

    @PutMapping("/articulos/{id}")
    public ResponseEntity<Articulo> actualizarArticulo(@PathVariable Long id, @RequestBody @Valid DatosRegistroArticulo datos) {
        return ResponseEntity.ok(inventarioService.actualizarArticulo(id, datos));
    }

    @DeleteMapping("/articulos/{id}")
    public ResponseEntity<Void> eliminarArticulo(@PathVariable Long id) {
        inventarioService.eliminarArticulo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/articulos/codigo/{codigo}")
    public ResponseEntity<Articulo> buscarPorCodigoBarras(@PathVariable String codigo) {
        return inventarioService.buscarPorCodigoBarras(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
