package com.ortiz.agenda.domain;

/**
 * Tipo de evento registrado en la agenda del profesor.
 */
public enum TipoAgenda {
    /** Bloque de atención a padres/alumnos */
    HORARIO_ATENCION,
    /** Reunión docente o administrativa */
    REUNION,
    /** Actividad extracurricular u otro evento */
    ACTIVIDAD,
    /** Evento de uso libre */
    OTRO
}
