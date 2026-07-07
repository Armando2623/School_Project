package com.ortiz.Proyecto.repository;

import com.ortiz.Proyecto.domain.Articulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    
    Optional<Articulo> findByCodigoBarras(String codigoBarras);
    
    List<Articulo> findByAreaId(Long areaId);

    @Query("SELECT a FROM Articulo a LEFT JOIN FETCH a.area WHERE a.area.id = :areaId")
    List<Articulo> findByAreaIdWithArea(@Param("areaId") Long areaId);

    @Query("SELECT a FROM Articulo a LEFT JOIN FETCH a.area")
    List<Articulo> findAllWithArea();
}
