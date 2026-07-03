package com.ortiz.Proyecto.repository;

import com.ortiz.Proyecto.domain.Visitante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitanteRepository extends JpaRepository<Visitante, Long> {
    Optional<Visitante> findByDniVisitante(String dniVisitante);
}
