import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,

    // ─── Security headers en desarrollo (espejo de producción) ───────────────
    headers: {
      // Política CSP: refleja el meta tag del index.html para que el header
      // HTTP también esté presente (el header tiene prioridad sobre el meta).
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
        "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://school-project-1mso.onrender.com",
        "connect-src 'self' https://school-project-1mso.onrender.com https://school-project-assitencia-service.onrender.com https://school-project-agendaservice.onrender.com http://localhost:8081 http://localhost:8082",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
      // Previene clickjacking
      'X-Frame-Options': 'DENY',
      // Evita que el navegador adivine el MIME type
      'X-Content-Type-Options': 'nosniff',
      // Política de referrer segura
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },

    proxy: {
      // Proxea las llamadas al MVC principal (evita CORS en dev)
      '/api': {
        target: 'https://school-project-1mso.onrender.com',
        changeOrigin: true,
      },
      // Proxea las llamadas al microservicio de asistencia
      '/asistencia-api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/asistencia-api/, '/api'),
      },
      // Proxea las llamadas al microservicio de agenda y horarios
      '/agenda-api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agenda-api/, '/api'),
      },
    },
  },
});
