package com.ortiz.Proyecto.service;

import com.ortiz.Proyecto.domain.EstadoRegistro;
import com.ortiz.Proyecto.domain.RegistroVisita;
import com.ortiz.Proyecto.domain.Usuario;
import com.ortiz.Proyecto.dto.DatosRegistroVisita;
import com.ortiz.Proyecto.repository.RegistroRepository;
import com.ortiz.Proyecto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Registra una nueva visita.
     * Resuelve la relación con Usuario por ID.
     * Asigna hora de ingreso y estado si vienen nulos.
     */
    public RegistroVisita registrar(DatosRegistroVisita datos) {
        Usuario usuario = usuarioRepository.findById(datos.usuario_id())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + datos.usuario_id()));

        RegistroVisita visita = new RegistroVisita();
        visita.setNombreVisitante(datos.nombreVisitante());
        visita.setDniVisitante(datos.dniVisitante());
        visita.setMotivo(datos.motivo());
        visita.setHoraIngreso(datos.horaIngreso() != null ? datos.horaIngreso() : LocalDateTime.now());
        visita.setEstadoRegistro(datos.estadoRegistro() != null ? datos.estadoRegistro() : EstadoRegistro.REGISTRADO);
        visita.setUsuario(usuario);

        return registroRepository.save(visita);
    }

    /**
     * Lista todas las visitas que tienen usuario vinculado.
     */
    public List<RegistroVisita> listar() {
        return registroRepository.findAll()
                .stream()
                .filter(v -> v.getUsuario() != null)
                .toList();
    }

    /**
     * Busca el visitante más reciente con ese DNI para autocompletado.
     */
    public Optional<RegistroVisita> buscarPorDni(String dni) {
        return registroRepository.findTopByDniVisitanteOrderByHoraIngresoDesc(dni);
    }

    /**
     * Lista todos los usuarios registrados (para el autocompletado de "Persona a Visitar").
     */
    public List<Usuario> buscarUsuarios(String search) {
        return usuarioRepository.findAll()
                .stream()
                .filter(u -> u.getNombre().toLowerCase().contains(search.toLowerCase()))
                .toList();
    }

    /**
     * Actualiza una visita existente (motivo, estado, usuario, hora).
     */
    public RegistroVisita actualizar(Long id, DatosRegistroVisita datos) {
        RegistroVisita visita = registroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visita no encontrada con id: " + id));

        visita.setNombreVisitante(datos.nombreVisitante());
        visita.setDniVisitante(datos.dniVisitante());
        visita.setMotivo(datos.motivo());

        if (datos.horaIngreso() != null) {
            visita.setHoraIngreso(datos.horaIngreso());
        }
        if (datos.estadoRegistro() != null) {
            visita.setEstadoRegistro(datos.estadoRegistro());
        }
        if (datos.usuario_id() != null) {
            Usuario usuario = usuarioRepository.findById(datos.usuario_id())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + datos.usuario_id()));
            visita.setUsuario(usuario);
        }

        return registroRepository.save(visita);
    }
}
