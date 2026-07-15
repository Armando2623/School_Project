package com.ortiz.asistencia.service;

import com.ortiz.asistencia.domain.RegistroAsistenciaAlumno;
import com.ortiz.asistencia.dto.AlumnoInfoDto;
import com.ortiz.asistencia.dto.DatosRegistroAsistenciaAlumno;
import com.ortiz.asistencia.repository.AsistenciaAlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de lógica de negocio para el registro de asistencia de alumnos via QR.
 *
 * Al registrar una asistencia:
 * 1. Llama al MVC (GET /api/alumnos/qr/{codigoQr}) para validar el QR y obtener datos del alumno.
 * 2. Guarda el registro de asistencia con los datos desnormalizados del alumno.
 *
 * Reutiliza el JWT del portero/admin para autenticarse en el MVC.
 */
@Service
public class AsistenciaAlumnoService {

    @Autowired
    private AsistenciaAlumnoRepository repository;

    @Autowired
    private NotificacionEmailService notificacionEmailService;

    @Value("${mvc.base-url:https://school-project-assitencia-service.onrender.com}")
 // se cambiara esto   @Value("${mvc.base-url:http://localhost:8080}")
    private String mvcBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Registra un nuevo evento de asistencia de un alumno via QR.
     *
     * @param datos   DTO con codigoQr, tipoEvento, etc.
     * @param jwtToken JWT del usuario autenticado (para llamar al MVC)
     * @return El registro guardado
     */
    public RegistroAsistenciaAlumno registrar(DatosRegistroAsistenciaAlumno datos, String jwtToken) {
        // 1. Validar QR y obtener datos del alumno desde el MVC
        AlumnoInfoDto alumnoInfo = obtenerAlumnoPorQr(datos.codigoQr(), jwtToken);

        // 2. Construir y guardar el registro de asistencia
        RegistroAsistenciaAlumno registro = new RegistroAsistenciaAlumno();
        registro.setAlumnoId(alumnoInfo.id());
        registro.setCodigoQr(datos.codigoQr());
        registro.setNombreAlumno(alumnoInfo.nombre());
        registro.setGrado(alumnoInfo.grado());
        registro.setSeccion(alumnoInfo.seccion());
        registro.setTipoEvento(datos.tipoEvento());
        LocalDateTime horaFinal = datos.horaEvento() != null ? datos.horaEvento() : LocalDateTime.now();
        registro.setHoraEvento(horaFinal);
        registro.setRegistradoPorId(datos.registradoPorId());
        registro.setObservaciones(datos.observaciones());

        RegistroAsistenciaAlumno guardado = repository.save(registro);

        // 3. Notificar al apoderado por email (asíncrono — no bloquea la respuesta)
        notificacionEmailService.enviarNotificacion(
                alumnoInfo.emailApoderado(),
                alumnoInfo.nombreApoderado(),
                alumnoInfo.nombre(),
                alumnoInfo.grado(),
                alumnoInfo.seccion(),
                datos.tipoEvento(),
                horaFinal
        );

        return guardado;
    }

    /** Llama al MVC para validar el QR y obtener los datos del alumno */
    private AlumnoInfoDto obtenerAlumnoPorQr(String codigoQr, String jwtToken) {
        String url = mvcBaseUrl + "/api/alumnos/qr/" + codigoQr;

        HttpHeaders headers = new HttpHeaders();
        if (jwtToken != null && !jwtToken.isBlank()) {
            headers.set("Authorization", "Bearer " + jwtToken);
        }
        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<AlumnoInfoDto> response = restTemplate.exchange(
                    url, HttpMethod.GET, request, AlumnoInfoDto.class
            );
            if (response.getBody() == null) {
                throw new RuntimeException("QR inválido: no se encontró ningún alumno con ese código");
            }
            return response.getBody();
        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("QR inválido: no se encontró ningún alumno con ese código QR");
        } catch (Exception e) {
            throw new RuntimeException("Error al validar el QR: " + e.getMessage());
        }
    }

    /** Lista todos los registros de asistencia de alumnos */
    public List<RegistroAsistenciaAlumno> listarTodos() {
        return repository.findAll();
    }

    /** Obtiene un registro por ID */
    public Optional<RegistroAsistenciaAlumno> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    /** Historial de asistencia de un alumno específico */
    public List<RegistroAsistenciaAlumno> listarPorAlumno(Long alumnoId) {
        return repository.findByAlumnoIdOrderByHoraEventoDesc(alumnoId);
    }

    /** Lista todos los registros de una fecha específica */
    public List<RegistroAsistenciaAlumno> listarPorFecha(LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin    = fecha.atTime(LocalTime.MAX);
        return repository.findByHoraEventoBetweenOrderByHoraEventoAsc(inicio, fin);
    }

    /** Lista registros de un alumno en una fecha específica */
    public List<RegistroAsistenciaAlumno> listarPorAlumnoYFecha(Long alumnoId, LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin    = fecha.atTime(LocalTime.MAX);
        return repository.findByAlumnoIdAndFecha(alumnoId, inicio, fin);
    }

    /** Lista registros de un grado en una fecha específica */
    public List<RegistroAsistenciaAlumno> listarPorGradoYFecha(String grado, LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin    = fecha.atTime(LocalTime.MAX);
        return repository.findByGradoAndFecha(grado, inicio, fin);
    }
}
