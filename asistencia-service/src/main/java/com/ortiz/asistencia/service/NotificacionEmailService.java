package com.ortiz.asistencia.service;

import com.ortiz.asistencia.domain.TipoEvento;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Servicio para enviar notificaciones por email a los padres/apoderados
 * cuando se registra la asistencia (ENTRADA o SALIDA) de su hijo/a.
 *
 * El envío se realiza de forma asíncrona (@Async) para no bloquear
 * la respuesta del registro de asistencia al portero.
 */
@Service
public class NotificacionEmailService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionEmailService.class);

    private static final DateTimeFormatter FORMATO_HORA =
            DateTimeFormatter.ofPattern("hh:mm a");
    private static final DateTimeFormatter FORMATO_FECHA =
            DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy",
                    new java.util.Locale("es", "PE"));

    @Autowired
    private JavaMailSender mailSender;

    @Value("${notificacion.email.from:TU_CORREO@gmail.com}")
    private String emailFrom;

    @Value("${notificacion.email.nombre-remitente:SchoolGuard}")
    private String nombreRemitente;

    /**
     * Envía un email de notificación al apoderado sobre la asistencia de su hijo.
     * Se ejecuta en un hilo separado (asíncrono) para no bloquear el registro.
     *
     * @param emailApoderado   Email del apoderado (null = no envía)
     * @param nombreApoderado  Nombre del apoderado para personalizar el saludo
     * @param nombreAlumno     Nombre del alumno
     * @param grado            Grado del alumno
     * @param seccion          Sección del alumno
     * @param tipoEvento       ENTRADA o SALIDA
     * @param horaEvento       Hora exacta del evento
     */
    @Async("notificacionExecutor")
    public void enviarNotificacion(
            String emailApoderado,
            String nombreApoderado,
            String nombreAlumno,
            String grado,
            String seccion,
            TipoEvento tipoEvento,
            LocalDateTime horaEvento) {

        log.info("[Notificacion] Iniciando proceso de envio de email para el alumno '{}' (Email apoderado: {})", 
                nombreAlumno, emailApoderado);

        // Si el apoderado no tiene email registrado, solo registramos una advertencia
        if (emailApoderado == null || emailApoderado.isBlank()) {
            log.warn("[Notificacion] Alumno '{}' sin email de apoderado - no se envio notificacion.",
                    nombreAlumno);
            return;
        }

        try {
            log.info("[Notificacion] Creando mensaje MIME para envio de correo...");
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setFrom(emailFrom, nombreRemitente);
            helper.setTo(emailApoderado);
            helper.setSubject(construirAsunto(tipoEvento, nombreAlumno));
            helper.setText(construirCuerpoHtml(
                    nombreApoderado, nombreAlumno, grado, seccion, tipoEvento, horaEvento), true);

            log.info("[Notificacion] Enviando correo a traves de JavaMailSender a {}...", emailApoderado);
            mailSender.send(mensaje);
            log.info("[Notificacion] Email enviado con exito a {} - Alumno: {} - Evento: {}",
                    emailApoderado, nombreAlumno, tipoEvento);

        } catch (Exception e) {
            // Capturamos Exception genérica (incluye MailException de Spring y NullPointerException)
            // El email falla silenciosamente para no afectar el registro de asistencia
            log.error("[Notificacion] Error critico al enviar email a {} para alumno '{}'. Mensaje: {}, Causa: {}",
                    emailApoderado, nombreAlumno, e.getMessage(), e.getCause(), e);
        }
    }

    // ── Helpers privados ──────────────────────────────────────────────────────

    private String construirAsunto(TipoEvento tipoEvento, String nombreAlumno) {
        String emoji = tipoEvento == TipoEvento.ENTRADA ? "✅" : "🔔";
        String tipo  = tipoEvento == TipoEvento.ENTRADA ? "ENTRADA" : "SALIDA";
        return emoji + " [" + tipo + "] " + nombreAlumno + " — SchoolGuard";
    }

    private String construirCuerpoHtml(
            String nombreApoderado,
            String nombreAlumno,
            String grado,
            String seccion,
            TipoEvento tipoEvento,
            LocalDateTime horaEvento) {

        boolean esEntrada  = tipoEvento == TipoEvento.ENTRADA;
        String  colorEvento = esEntrada ? "#10b981" : "#ef4444";
        String  emojiEvento = esEntrada ? "▶" : "◀";
        String  textoEvento = esEntrada ? "ENTRADA" : "SALIDA";
        String  gradoSeccion = (grado != null ? grado : "—") + " " + (seccion != null ? seccion : "");
        String  horaStr  = horaEvento != null ? horaEvento.format(FORMATO_HORA) : "—";
        String  fechaStr = horaEvento != null ? horaEvento.format(FORMATO_FECHA) : "—";
        String  saludo   = (nombreApoderado != null && !nombreApoderado.isBlank())
                           ? "Estimado/a <strong>" + nombreApoderado + "</strong>,"
                           : "Estimado/a apoderado/a,";

        return """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>Notificación de Asistencia — SchoolGuard</title>
                </head>
                <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
                    <tr><td align="center">
                      <table width="560" cellpadding="0" cellspacing="0"
                             style="background:#ffffff;border-radius:16px;overflow:hidden;
                                    box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:560px;width:100%%;">

                        <!-- Cabecera -->
                        <tr>
                          <td style="background:linear-gradient(135deg,#1e293b 0%%,#334155 100%%);
                                     padding:28px 32px;text-align:center;">
                            <div style="font-size:28px;letter-spacing:1px;color:#ffffff;font-weight:700;">
                              🏫 SchoolGuard
                            </div>
                            <div style="color:#94a3b8;font-size:13px;margin-top:4px;">
                              Sistema de Asistencia Escolar
                            </div>
                          </td>
                        </tr>

                        <!-- Badge de evento -->
                        <tr>
                          <td style="padding:0;text-align:center;background:#f8fafc;">
                            <div style="display:inline-block;background:%s;color:#fff;
                                        font-size:15px;font-weight:700;letter-spacing:1px;
                                        padding:10px 32px;border-radius:0 0 24px 24px;">
                              %s %s
                            </div>
                          </td>
                        </tr>

                        <!-- Cuerpo -->
                        <tr>
                          <td style="padding:32px 32px 16px;">
                            <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
                              %s
                            </p>
                            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                              Su hijo/a ha registrado asistencia en el colegio:
                            </p>

                            <!-- Tarjeta de datos -->
                            <table width="100%%" cellpadding="0" cellspacing="0"
                                   style="background:#f8fafc;border:1.5px solid #e2e8f0;
                                          border-radius:12px;overflow:hidden;">
                              <tr>
                                <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                                  <span style="color:#64748b;font-size:12px;font-weight:600;
                                               text-transform:uppercase;letter-spacing:0.5px;">Alumno</span>
                                  <div style="color:#0f172a;font-size:18px;font-weight:700;margin-top:4px;">
                                    🎒 %s
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;">
                                  <table width="100%%"><tr>
                                    <td width="50%%">
                                      <span style="color:#64748b;font-size:12px;font-weight:600;
                                                   text-transform:uppercase;letter-spacing:0.5px;">Grado / Sección</span>
                                      <div style="color:#0f172a;font-size:14px;font-weight:600;margin-top:4px;">
                                        📚 %s
                                      </div>
                                    </td>
                                    <td width="50%%">
                                      <span style="color:#64748b;font-size:12px;font-weight:600;
                                                   text-transform:uppercase;letter-spacing:0.5px;">Tipo de Evento</span>
                                      <div style="color:%s;font-size:14px;font-weight:700;margin-top:4px;">
                                        %s %s
                                      </div>
                                    </td>
                                  </tr></table>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:14px 20px;">
                                  <table width="100%%"><tr>
                                    <td width="50%%">
                                      <span style="color:#64748b;font-size:12px;font-weight:600;
                                                   text-transform:uppercase;letter-spacing:0.5px;">Hora</span>
                                      <div style="color:#0f172a;font-size:14px;font-weight:600;margin-top:4px;">
                                        🕐 %s
                                      </div>
                                    </td>
                                    <td width="50%%">
                                      <span style="color:#64748b;font-size:12px;font-weight:600;
                                                   text-transform:uppercase;letter-spacing:0.5px;">Fecha</span>
                                      <div style="color:#0f172a;font-size:14px;font-weight:600;margin-top:4px;">
                                        📅 %s
                                      </div>
                                    </td>
                                  </tr></table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Nota -->
                        <tr>
                          <td style="padding:16px 32px 32px;">
                            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;
                                       border-top:1px solid #e2e8f0;padding-top:16px;">
                              Este es un mensaje automático generado por el sistema SchoolGuard.
                              Por favor no responda a este correo.
                              Si cree que este mensaje es un error, contacte a la administración del colegio.
                            </p>
                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="background:#1e293b;padding:16px 32px;text-align:center;">
                            <span style="color:#64748b;font-size:11px;">
                              © 2026 SchoolGuard — Sistema de Gestión Escolar
                            </span>
                          </td>
                        </tr>

                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """.formatted(
                colorEvento, emojiEvento, textoEvento,   // badge
                saludo,                                   // saludo
                nombreAlumno,                             // nombre alumno
                gradoSeccion,                             // grado/sección
                colorEvento, emojiEvento, textoEvento,   // tipo evento en tarjeta
                horaStr,                                  // hora
                fechaStr                                  // fecha
        );
    }
}
