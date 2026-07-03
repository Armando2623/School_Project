package com.ortiz.asistencia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Habilita el procesamiento asíncrono con @Async en el microservicio.
 *
 * El envío de emails a los padres de familia se ejecuta en un hilo separado
 * para no bloquear la respuesta del registro de asistencia. Así el portero
 * recibe la confirmación de registro inmediatamente, y el email se envía
 * en segundo plano.
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * Executor dedicado para el envío de notificaciones.
     * Pool de 2-5 hilos con cola de 100 tareas pendientes.
     */
    @Bean(name = "notificacionExecutor")
    public Executor notificacionExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("notif-email-");
        executor.initialize();
        return executor;
    }
}
