package com.ortiz.asistencia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*
 Microservicio SOA — Registro de Asistencia del Personal Escolar.

 Responsabilidad única: gestionar los registros de entrada/salida
 del personal del colegio (porteros, profesores, secretarias, directores)
 Corre en el puerto 8081. Valida el mismo token JWT emitido por el MVC
 principal (puerto 8080) para no requerir nuevo login.
 */
@SpringBootApplication
public class AsistenciaApplication {

    public static void main(String[] args) {
        SpringApplication.run(AsistenciaApplication.class, args);
    }
}
