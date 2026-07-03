package com.ortiz.Proyecto.repository;

import com.ortiz.Proyecto.domain.RegistroVisita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistroRepository extends JpaRepository<RegistroVisita, Long> {
    Optional<RegistroVisita> findTopByDniVisitanteOrderByHoraIngresoDesc(String dniVisitante);
}
