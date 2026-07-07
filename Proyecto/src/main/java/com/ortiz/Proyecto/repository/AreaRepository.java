package com.ortiz.Proyecto.repository;

import com.ortiz.Proyecto.domain.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AreaRepository extends JpaRepository<Area, Long> {
    Optional<Area> findByNombre(String nombre);
}
