package com.ortiz.Proyecto.service;

import com.ortiz.Proyecto.domain.Area;
import com.ortiz.Proyecto.domain.Articulo;
import com.ortiz.Proyecto.dto.DatosRegistroArea;
import com.ortiz.Proyecto.dto.DatosRegistroArticulo;
import com.ortiz.Proyecto.repository.AreaRepository;
import com.ortiz.Proyecto.repository.ArticuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class InventarioService {

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private ArticuloRepository articuloRepository;

    @Autowired
    private AuditoriaService auditoriaService;

    // --- Gestión de Áreas ---

    public List<Area> listarAreas() {
        return areaRepository.findAll();
    }

    public Optional<Area> obtenerArea(Long id) {
        return areaRepository.findById(id);
    }

    @Transactional
    public Area registrarArea(DatosRegistroArea datos) {
        if (areaRepository.findByNombre(datos.nombre()).isPresent()) {
            throw new RuntimeException("Ya existe un área o aula con el nombre: " + datos.nombre());
        }
        Area area = new Area(datos.nombre(), datos.tipo(), datos.descripcion());
        Area creada = areaRepository.save(area);
        auditoriaService.registrarLog("CREAR_AREA", "Se registró el área/aula: " + creada.getNombre() + " (Tipo: " + creada.getTipo() + ")");
        return creada;
    }

    // --- Gestión de Artículos ---

    public List<Articulo> listarArticulos(Long areaId) {
        if (areaId != null) {
            return articuloRepository.findByAreaIdWithArea(areaId);
        }
        return articuloRepository.findAllWithArea();
    }

    public Optional<Articulo> obtenerArticulo(Long id) {
        return articuloRepository.findById(id);
    }

    public Optional<Articulo> buscarPorCodigoBarras(String codigoBarras) {
        return articuloRepository.findByCodigoBarras(codigoBarras);
    }

    @Transactional
    public Articulo registrarArticulo(DatosRegistroArticulo datos) {
        Area area = areaRepository.findById(datos.areaId())
                .orElseThrow(() -> new RuntimeException("Área no encontrada con ID: " + datos.areaId()));

        String codigo = datos.codigoBarras();
        if (codigo == null || codigo.trim().isEmpty()) {
            codigo = generarCodigoBarrasUnico();
        } else {
            // Validar unicidad si el usuario provee uno manual
            if (articuloRepository.findByCodigoBarras(codigo).isPresent()) {
                throw new RuntimeException("El código de barras '" + codigo + "' ya está registrado en el inventario.");
            }
        }

        Articulo articulo = new Articulo(
                datos.nombre(),
                datos.descripcion(),
                codigo,
                datos.estado() != null ? datos.estado() : "EXCELENTE",
                datos.cantidad(),
                area
        );

        // Asociar fotos si vienen en el DTO
        if (datos.fotos() != null && !datos.fotos().isEmpty()) {
            for (String base64 : datos.fotos()) {
                if (base64 != null && !base64.trim().isEmpty()) {
                    articulo.getFotos().add(new com.ortiz.Proyecto.domain.ArticuloFoto(base64, articulo));
                }
            }
        }

        Articulo creado = articuloRepository.save(articulo);
        auditoriaService.registrarLog("CREAR_ARTICULO", "Se inventarió artículo: " + creado.getNombre() + 
                " (Código: " + creado.getCodigoBarras() + ", Área: " + area.getNombre() + ")");
        return creado;
    }

    @Transactional
    public Articulo actualizarArticulo(Long id, DatosRegistroArticulo datos) {
        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado con ID: " + id));

        Area area = areaRepository.findById(datos.areaId())
                .orElseThrow(() -> new RuntimeException("Área no encontrada con ID: " + datos.areaId()));

        String codigo = datos.codigoBarras();
        if (codigo != null && !codigo.trim().isEmpty() && !codigo.equals(articulo.getCodigoBarras())) {
            // Si el código cambió, validar unicidad
            if (articuloRepository.findByCodigoBarras(codigo).isPresent()) {
                throw new RuntimeException("El código de barras '" + codigo + "' ya está registrado.");
            }
            articulo.setCodigoBarras(codigo);
        }

        articulo.setNombre(datos.nombre());
        articulo.setDescripcion(datos.descripcion());
        articulo.setEstado(datos.estado() != null ? datos.estado() : "EXCELENTE");
        articulo.setCantidad(datos.cantidad());
        articulo.setArea(area);

        // Actualizar fotos (limpiar anteriores y guardar nuevas)
        articulo.getFotos().clear();
        if (datos.fotos() != null && !datos.fotos().isEmpty()) {
            for (String base64 : datos.fotos()) {
                if (base64 != null && !base64.trim().isEmpty()) {
                    articulo.getFotos().add(new com.ortiz.Proyecto.domain.ArticuloFoto(base64, articulo));
                }
            }
        }

        Articulo actualizado = articuloRepository.save(articulo);
        auditoriaService.registrarLog("ACTUALIZAR_ARTICULO", "Se actualizó artículo ID: " + id + 
                " (" + actualizado.getNombre() + ", Área: " + area.getNombre() + ")");
        return actualizado;
    }

    @Transactional
    public void eliminarArticulo(Long id) {
        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado con ID: " + id));
        articuloRepository.delete(articulo);
        auditoriaService.registrarLog("ELIMINAR_ARTICULO", "Se eliminó del inventario el artículo: " + 
                articulo.getNombre() + " (Código: " + articulo.getCodigoBarras() + ")");
    }

    // --- Helper para autogenerar códigos de barra SG-XXXXXXXX ---
    private String generarCodigoBarrasUnico() {
        Random random = new Random();
        String codigo;
        do {
            // Genera un número de 8 dígitos aleatorios
            int num = 10000000 + random.nextInt(90000000);
            codigo = "SG-" + num;
        } while (articuloRepository.findByCodigoBarras(codigo).isPresent());
        return codigo;
    }
}
