import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
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
