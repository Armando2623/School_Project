package com.ortiz.Proyecto.repository;

import com.ortiz.Proyecto.domain.AuditoriaLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditoriaLogRepository extends JpaRepository<AuditoriaLog, Long> {
    List<AuditoriaLog> findAllByOrderByFechaDesc();
}
