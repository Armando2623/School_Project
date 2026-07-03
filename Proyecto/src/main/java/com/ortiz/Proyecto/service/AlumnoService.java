package com.ortiz.Proyecto.service;

import com.ortiz.Proyecto.domain.Alumno;
import com.ortiz.Proyecto.domain.Visitante;
import com.ortiz.Proyecto.dto.DatosRegistroAlumno;
import com.ortiz.Proyecto.repository.AlumnoRepository;
import com.ortiz.Proyecto.repository.VisitanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private VisitanteRepository visitanteRepository;

    /** Lista todos los alumnos */
    public List<Alumno> listar() {
        return alumnoRepository.findAll();
    }

    /** Obtiene un alumno por ID */
    public Optional<Alumno> obtener(Long id) {
        return alumnoRepository.findById(id);
    }

    /**
     * Registra un nuevo alumno y lo vincula con su apoderado si se proporciona ID.
     */
    public Alumno registrar(DatosRegistroAlumno datos) {
        Alumno alumno = new Alumno(datos.nombre(), datos.grado(), datos.seccion());

        // Generar UUID único como código QR del alumno
        alumno.setCodigoQr(UUID.randomUUID().toString());

        if (datos.visitanteId() != null) {
            Visitante apoderado = visitanteRepository.findById(datos.visitanteId())
                    .orElseThrow(() -> new RuntimeException("Apoderado no encontrado con id: " + datos.visitanteId()));
            alumno.setApoderado(apoderado);
        }

        return alumnoRepository.save(alumno);
    }

    /** Lista los alumnos de un apoderado específico */
    public List<Alumno> listarPorApoderado(Long visitanteId) {
        return alumnoRepository.findByApoderadoId(visitanteId);
    }

    /**
     * Actualiza los datos de un alumno existente por ID.
     */
    public Alumno actualizar(Long id, DatosRegistroAlumno datos) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado con id: " + id));

        alumno.setNombre(datos.nombre());
        alumno.setGrado(datos.grado());
        alumno.setSeccion(datos.seccion());

        if (datos.visitanteId() != null) {
            Visitante apoderado = visitanteRepository.findById(datos.visitanteId())
                    .orElseThrow(() -> new RuntimeException("Apoderado no encontrado con id: " + datos.visitanteId()));
            alumno.setApoderado(apoderado);
        } else {
            alumno.setApoderado(null);
        }

        return alumnoRepository.save(alumno);
    }

    /**
     * Busca un alumno por su código QR (UUID único), cargando el apoderado en la misma consulta.
     * Usado para validar el QR escaneado en el sistema de asistencia y para obtener
     * el email del apoderado con el fin de enviar notificaciones automáticas.
     */
    public Optional<Alumno> buscarPorCodigoQr(String codigoQr) {
        return alumnoRepository.findByCodigoQrWithApoderado(codigoQr);
    }
}

