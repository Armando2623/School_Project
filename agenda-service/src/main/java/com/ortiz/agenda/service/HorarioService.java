package com.ortiz.agenda.service;

import com.ortiz.agenda.domain.DiaSemana;
import com.ortiz.agenda.domain.HorarioSemanal;
import com.ortiz.agenda.dto.DatosHorarioSemanal;
import com.ortiz.agenda.repository.HorarioSemanalRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Servicio de lógica de negocio para los horarios semanales de los profesores.
 *
 * Gestiona la creación, actualización, consulta y eliminación
 * de bloques de horario semanal.
 */
@Service
public class HorarioService {

    @Autowired
    private HorarioSemanalRepository horarioRepository;

    /**
     * Crea un nuevo bloque de horario semanal.
     * Por defecto, el horario queda activo al crearse.
     */
    @Transactional
    public HorarioSemanal crear(DatosHorarioSemanal datos) {
        HorarioSemanal horario = new HorarioSemanal();
        mapearDatos(datos, horario);
        // Si no se especificó activo en el DTO, se establece true por defecto
        if (datos.getActivo() == null) {
            horario.setActivo(true);
        }
        return horarioRepository.save(horario);
    }

    /**
     * Actualiza un bloque de horario existente por su ID.
     * Lanza EntityNotFoundException si el bloque no existe.
     */
    @Transactional
    public HorarioSemanal actualizar(Long id, DatosHorarioSemanal datos) {
        HorarioSemanal horario = horarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con ID: " + id));
        mapearDatos(datos, horario);
        return horarioRepository.save(horario);
    }

    /**
     * Elimina un bloque de horario por su ID.
     */
    @Transactional
    public void eliminar(Long id) {
        if (!horarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Horario no encontrado con ID: " + id);
        }
        horarioRepository.deleteById(id);
    }

    /** Lista todos los bloques de horario activos (vista general del colegio). */
    public List<HorarioSemanal> listarActivos() {
        return horarioRepository.findByActivoOrderByDiaSemanaAscHoraInicioAsc(true);
    }

    /** Lista todos los bloques de horario (activos e inactivos). */
    public List<HorarioSemanal> listarTodos() {
        return horarioRepository.findAll();
    }

    /** Obtiene un bloque por su ID. */
    public Optional<HorarioSemanal> obtenerPorId(Long id) {
        return horarioRepository.findById(id);
    }

    /** Lista todos los bloques de horario de un profesor, ordenados por día y hora. */
    public List<HorarioSemanal> listarPorProfesor(Long profesorId) {
        return horarioRepository.findByProfesorIdOrderByDiaSemanaAscHoraInicioAsc(profesorId);
    }

    /** Lista solo los bloques activos de un profesor. */
    public List<HorarioSemanal> listarActivosPorProfesor(Long profesorId) {
        return horarioRepository.findByProfesorIdAndActivoOrderByDiaSemanaAscHoraInicioAsc(profesorId, true);
    }

    /** Lista todos los bloques de un día de la semana (activos e inactivos). */
    public List<HorarioSemanal> listarPorDia(DiaSemana diaSemana) {
        return horarioRepository.findByDiaSemanaOrderByHoraInicioAsc(diaSemana);
    }

    /** Lista los bloques activos de un día de la semana. */
    public List<HorarioSemanal> listarActivosPorDia(DiaSemana diaSemana) {
        return horarioRepository.findByDiaSemanaAndActivoOrderByHoraInicioAsc(diaSemana, true);
    }

    // ── Métodos internos ──────────────────────────────────────────────────────

    private void mapearDatos(DatosHorarioSemanal datos, HorarioSemanal horario) {
        horario.setProfesorId(datos.getProfesorId());
        horario.setNombreProfesor(datos.getNombreProfesor());
        horario.setDiaSemana(datos.getDiaSemana());
        horario.setHoraInicio(datos.getHoraInicio());
        horario.setHoraFin(datos.getHoraFin());
        horario.setMateria(datos.getMateria());
        horario.setAula(datos.getAula());
        horario.setObservaciones(datos.getObservaciones());
        if (datos.getActivo() != null) {
            horario.setActivo(datos.getActivo());
        }
    }
}
