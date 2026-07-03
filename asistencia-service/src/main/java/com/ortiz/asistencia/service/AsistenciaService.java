package com.ortiz.asistencia.service;

import com.ortiz.asistencia.domain.RegistroAsistencia;
import com.ortiz.asistencia.dto.DatosRegistroAsistencia;
import com.ortiz.asistencia.repository.AsistenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de lógica de negocio para el registro de asistencia del personal.
 *
 * Responsabilidades:
 *  - Registrar eventos de entrada/salida
 *  - Consultar historial por personal
 *  - Consultar registros por fecha (para reportes)
 *  - Listar todos los registros
 */
@Service
public class AsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    /**
     * Registra un nuevo evento de asistencia.
     * Si horaEvento viene null, se asigna la hora actual del servidor.
     */
    public RegistroAsistencia registrar(DatosRegistroAsistencia datos) {
        RegistroAsistencia registro = new RegistroAsistencia();
        registro.setUsuarioId(datos.usuarioId());
        registro.setNombrePersonal(datos.nombrePersonal());
        registro.setRolPersonal(datos.rolPersonal());
        registro.setTipoEvento(datos.tipoEvento());
        registro.setHoraEvento(
                datos.horaEvento() != null ? datos.horaEvento() : LocalDateTime.now()
        );
        registro.setObservaciones(datos.observaciones());

        return asistenciaRepository.save(registro);
    }

    /** Lista todos los registros de asistencia ordenados del más reciente al más antiguo */
    public List<RegistroAsistencia> listarTodos() {
        return asistenciaRepository.findAll();
    }

    /** Obtiene un registro por ID */
    public Optional<RegistroAsistencia> obtenerPorId(Long id) {
        return asistenciaRepository.findById(id);
    }

    /** Lista todos los registros de un miembro del personal (por usuarioId del MVC) */
    public List<RegistroAsistencia> listarPorPersonal(Long usuarioId) {
        return asistenciaRepository.findByUsuarioIdOrderByHoraEventoDesc(usuarioId);
    }

    /**
     * Lista todos los registros de una fecha específica.
     * Abarca desde las 00:00:00 hasta las 23:59:59 de ese día.
     */
    public List<RegistroAsistencia> listarPorFecha(LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin    = fecha.atTime(LocalTime.MAX);
        return asistenciaRepository.findByHoraEventoBetweenOrderByHoraEventoAsc(inicio, fin);
    }

    /**
     * Lista los registros de un miembro del personal en una fecha específica.
     * Útil para ver sus entradas/salidas del día.
     */
    public List<RegistroAsistencia> listarPorPersonalYFecha(Long usuarioId, LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin    = fecha.atTime(LocalTime.MAX);
        return asistenciaRepository.findByUsuarioIdAndFecha(usuarioId, inicio, fin);
    }
}
