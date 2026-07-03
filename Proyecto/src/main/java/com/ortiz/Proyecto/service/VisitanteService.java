package com.ortiz.Proyecto.service;

import com.ortiz.Proyecto.domain.Visitante;
import com.ortiz.Proyecto.dto.DatosRegistroVisitante;
import com.ortiz.Proyecto.repository.VisitanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class VisitanteService {

    @Autowired
    private VisitanteRepository visitanteRepository;

    /**
     * Registra un visitante nuevo, o devuelve el existente si el DNI ya está.
     * (Operación idempotente — sin duplicados)
     */
    public Visitante registrarOBuscar(DatosRegistroVisitante datos) {
        return visitanteRepository.findByDniVisitante(datos.dniVisitante())
                .orElseGet(() -> {
                    Visitante nuevo = new Visitante(
                            datos.dniVisitante(),
                            datos.nombreVisitante(),
                            datos.telefono(),
                            datos.email());
                    return visitanteRepository.save(nuevo);
                });
    }

    /**
     * Busca un visitante por DNI y construye la respuesta con sus hijos.
     */
    public Optional<Map<String, Object>> buscarPorDni(String dni) {
        return visitanteRepository.findByDniVisitante(dni).map(v -> {
            List<Map<String, String>> hijos = v.getHijos().stream()
                    .map(a -> Map.of(
                            "nombre", a.getNombre(),
                            "grado", a.getGrado(),
                            "seccion", a.getSeccion()))
                    .toList();

            return Map.<String, Object>of(
                    "id", v.getId(),
                    "dniVisitante", v.getDniVisitante(),
                    "nombreVisitante", v.getNombreVisitante(),
                    "telefono", v.getTelefono() != null ? v.getTelefono() : "",
                    "email", v.getEmail() != null ? v.getEmail() : "",
                    "hijos", hijos);
        });
    }

    /** Lista todos los visitantes */
    public List<Visitante> listar() {
        return visitanteRepository.findAll();
    }

    /**
     * Actualiza los datos de un visitante existente por ID.
     */
    public Visitante actualizar(Long id, DatosRegistroVisitante datos) {
        Visitante visitante = visitanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitante no encontrado con id: " + id));

        visitante.setDniVisitante(datos.dniVisitante());
        visitante.setNombreVisitante(datos.nombreVisitante());
        visitante.setTelefono(datos.telefono());
        visitante.setEmail(datos.email());

        return visitanteRepository.save(visitante);
    }
}
