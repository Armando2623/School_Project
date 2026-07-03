package com.ortiz.agenda.domain;

/**
 * Estado del evento en la agenda del profesor.
 */
public enum EstadoAgenda {
    /** El evento está vigente */
    ACTIVO,
    /** El evento fue cancelado */
    CANCELADO,
    /** El evento ya ocurrió */
    COMPLETADO
}
