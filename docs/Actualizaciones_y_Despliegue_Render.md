# 🚀 Actualizaciones Recientes y Guía de Despliegue en Render — SchoolGuard (ViraSchool)

Este documento detalla las últimas actualizaciones de software integradas en el sistema **SchoolGuard (ViraSchool)** y proporciona una guía detallada paso a paso para el despliegue tanto del Frontend como de los Microservicios Backend en la plataforma **Render**.

---

## 📋 1. Nuevas Actualizaciones Realizadas

### A. Migración del Servicio de Notificación por Correo (`asistencia-service`)
* **Problema Original**: Se utilizaba `JavaMailSender` a través del protocolo SMTP (servidor `smtp.gmail.com` en puertos como 587). Sin embargo, **Render bloquea por defecto todos los puertos de salida SMTP tradicionales (25, 465, 587)** para evitar spam. Esto impedía que se enviaran correos de notificación desde el entorno de producción.
* **Solución Implementada**:
  * Se migró la infraestructura de envío de correos hacia la **API HTTP de Resend**. Al realizar envíos a través de peticiones HTTP POST seguras, se elude completamente el bloqueo de puertos de Render.
  * **Cambios en [pom.xml](file:///c:/Users/JUAN/Documents/PROYECTOS/School/School_Project/asistencia-service/pom.xml)**: Se removió la dependencia `spring-boot-starter-mail` y se integró el SDK de Java de Resend:
    ```xml
    <dependency>
        <groupId>com.resend</groupId>
        <artifactId>resend-java</artifactId>
        <version>3.2.0</version>
    </dependency>
    ```
  * **Cambios en Código ([NotificacionEmailService.java](file:///c:/Users/JUAN/Documents/PROYECTOS/School/School_Project/asistencia-service/src/main/java/com/ortiz/asistencia/service/NotificacionEmailService.java))**: Se reemplazó la inyección de `JavaMailSender` por el cliente `Resend`, inicializado dinámicamente con una API Key. El método asíncrono ahora construye y despacha la petición de correo mediante `CreateEmailOptions` de forma asíncrona.
  * **Cambios en Configuración ([application.properties](file:///c:/Users/JUAN/Documents/PROYECTOS/School/School_Project/asistencia-service/src/main/resources/application.properties))**: Se eliminaron los parámetros `spring.mail.*` y se introdujo la propiedad:
    ```properties
    resend.api-key=${RESEND_API_KEY:re_your_api_key_here}
    ```

### B. Módulo de Inventario: Exportación a PDF Nativo (`frontend`)
* **Problema Original**: La descarga de PDF se realizaba cargando un documento HTML en un iframe oculto para lanzar el diálogo de impresión del navegador (`window.print()`). Este enfoque dependía de la interfaz del navegador, bloqueadores de ventanas emergentes y a menudo deformaba la tabla.
* **Solución Implementada**:
  * Se integró la generación y exportación directa de PDFs en formato PDF nativo utilizando las librerías `jspdf` y `jspdf-autotable`.
  * **Dependencias**: Agregadas en `frontend/package.json`:
    * `"jspdf": "^4.2.1"`
    * `"jspdf-autotable": "^5.0.8"`
  * **Implementación (`frontend/src/pages/inventario.js`)**: El método `downloadPDF()` ahora crea un objeto `jsPDF` en orientación horizontal (`landscape`), tamaño A4, y dibuja una tabla estructurada y estilizada con un encabezado temático morado/índigo (`#4f46e5`). El archivo se guarda directamente en el dispositivo local con el nombre del aula/área correspondiente (ej. `inventario_Aula_A.pdf`).

### C. Módulo de Inventario: Generación de Códigos de Barras
* Se actualizaron los endpoints del backend (`Articulo.java`, `DatosRegistroArticulo.java`, `InventarioService.java` en `Proyecto/`) y la interfaz en el frontend (`inventario.js`) para soportar la creación, visualización y gestión del campo de código de barras. Esto permite etiquetar de forma única cada recurso y artículo de las aulas escolares.

### D. Seguridad y Base de Datos (Aiven MySQL)
* **JWT Filter**: Se corrigieron y optimizaron las validaciones en `JwtAuthenticationFilter.java` del servicio principal (`SchoolGuard-MVC` / `Proyecto`) para garantizar que las cabeceras `Authorization` se procesen correctamente y las llamadas API desde el frontend no sean rechazadas.
* **Base de Datos en Aiven**: Se adaptaron los archivos `application.properties` para soportar la conexión dinámica a clústeres MySQL externos de Aiven, permitiendo su despliegue y persistencia global.

---

## 🚀 2. Guía de Despliegue en Render

Para lograr que la aplicación web funcione correctamente en Render con su base de datos externa y sistema de microservicios, se deben desplegar un total de **4 servicios** (1 Frontend y 3 Backend).

### Paso 1: Configurar la Base de Datos Externa (Aiven, Railway, etc.)
1. Cree una base de datos MySQL en un proveedor en la nube (como Aiven).
2. Obtenga la cadena de conexión JDBC, usuario y contraseña.
3. Cree un esquema llamado `schoolguard`. Las tablas se generarán automáticamente gracias a la configuración de Spring Boot (`spring.jpa.hibernate.ddl-auto=update`).

---

### Paso 2: Despliegue de los Microservicios Backend (Java Spring Boot)
Se deben crear **3 Web Services** en Render, uno para cada microservicio del repositorio.

#### A. SchoolGuard-MVC (Servicio Principal / `Proyecto`)
* **Repositorio**: Selecciona tu repositorio git.
* **Root Directory**: `Proyecto` (o la ruta donde se encuentra el microservicio principal).
* **Build Command**: `mvn clean install -DskipTests`
* **Start Command**: `java -jar target/Proyecto-0.0.1-SNAPSHOT.jar` (verifica el nombre exacto del archivo `.jar` generado en la carpeta `target`).
* **Environment Variables**:
  * `PORT`: Inyectado automáticamente por Render (Spring Boot lo consume vía `server.port=${PORT:8080}`).
  * `DATABASE_URL`: `jdbc:mysql://<host>:<port>/schoolguard`
  * `DATABASE_USER`: `<tu_usuario>`
  * `DATABASE_PASSWORD`: `<tu_contraseña>`
  * `JWT_SECRET`: `<cadena_secreta_segura>` (debe ser la misma en todos los microservicios).

#### B. Asistencia-Service
* **Root Directory**: `asistencia-service`
* **Build Command**: `mvn clean install -DskipTests`
* **Start Command**: `java -jar target/asistencia-0.0.1-SNAPSHOT.jar`
* **Environment Variables**:
  * `PORT`: Asignado por Render.
  * `DATABASE_URL`: `jdbc:mysql://<host>:<port>/schoolguard`
  * `DATABASE_USER`: `<tu_usuario>`
  * `DATABASE_PASSWORD`: `<tu_contraseña>`
  * `JWT_SECRET`: `<cadena_secreta_segura>`
  * `RESEND_API_KEY`: `<tu_api_key_de_resend>` (Obtenida de [Resend.com](https://resend.com/api-keys)).
  * `MAIL_USERNAME`: `<tu_correo_de_envio>` (Ej: `onboarding@resend.dev` o tu dominio verificado).

#### C. Agenda-Service
* **Root Directory**: `agenda-service`
* **Build Command**: `mvn clean install -DskipTests`
* **Start Command**: `java -jar target/agenda-0.0.1-SNAPSHOT.jar`
* **Environment Variables**:
  * `PORT`: Asignado por Render.
  * `DATABASE_URL`: `jdbc:mysql://<host>:<port>/schoolguard`
  * `DATABASE_USER`: `<tu_usuario>`
  * `DATABASE_PASSWORD`: `<tu_contraseña>`
  * `JWT_SECRET`: `<cadena_secreta_segura>`

---

### Paso 3: Despliegue del Frontend (Vite + Vanilla JS)
El frontend se despliega como un **Static Site** en Render.

1. **Root Directory**: `frontend`
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. **Environment Variables / Rutas**:
   * Las URLs de conexión con los microservicios backend deben configurarse en `frontend/src/api/client.js` para apuntar a los Web Services creados en Render:
     - `MVC_URL` -> `https://school-project-1mso.onrender.com` (URL del backend principal)
     - `AST_URL` -> `https://school-project-assitencia-service.onrender.com` (URL del servicio de asistencia)
     - `AGENDA_URL` -> `https://school-project-agendaservice.onrender.com` (URL del servicio de agenda)

---

### ⚠️ Consideraciones Importantes sobre el Entorno de Producción
1. **Primer Arranque (Cold Start)**: Como se utilizan las instancias gratuitas de Render, los Web Services se "duermen" si no reciben tráfico en 15 minutos. El primer inicio de sesión o escaneo de código de barras tras un periodo de inactividad puede tardar de 50 a 90 segundos mientras se despiertan los servicios.
2. **Generación de API Key en Resend**:
   * Regístrate gratis en [Resend.com](https://resend.com).
   * Genera una API Key desde el dashboard y pégala en la variable de entorno `RESEND_API_KEY` en Render.
   * Si usas el dominio gratuito `onboarding@resend.dev`, solo podrás enviar correos a la dirección de correo con la que te registraste en Resend. Para enviar correos a cualquier apoderado, deberás verificar un dominio propio en la pestaña *Domains* de Resend.
