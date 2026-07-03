package com.ortiz.Proyecto.service;

import com.ortiz.Proyecto.domain.AuditoriaLog;
import com.ortiz.Proyecto.repository.AuditoriaLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditoriaService {

    @Autowired
    private AuditoriaLogRepository repository;

    public AuditoriaLog registrarLog(String usuario, String rol, String accion, String detalles) {
        AuditoriaLog log = new AuditoriaLog();
        log.setUsuario(usuario);
        log.setRol(rol);
        log.setAccion(accion);
        log.setDetalles(detalles);
        return repository.save(log);
    }

    public AuditoriaLog registrarLog(String accion, String detalles) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String usuario = "SISTEMA";
        String rol = "SISTEMA";
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            usuario = auth.getName();
            rol = auth.getAuthorities().stream()
                    .map(r -> r.getAuthority().replace("ROLE_", ""))
                    .findFirst()
                    .orElse("DESCONOCIDO");
        }
        return registrarLog(usuario, rol, accion, detalles);
    }

    public List<AuditoriaLog> listarTodos() {
        return repository.findAllByOrderByFechaDesc();
    }
}
