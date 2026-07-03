package com.ortiz.agenda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada del microservicio SOA de Agenda y Horarios.
 *
 * Gestiona la agenda y los horarios semanales de los profesores del colegio.
 * Se integra con el sistema principal SchoolGuard mediante validación JWT compartida.
 *
 * Puerto: 8082
 * Base de datos: colegio_db (tablas: agenda_profesor, horario_semanal)
 */
@SpringBootApplication
public class AgendaApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgendaApplication.class, args);
    }
}
