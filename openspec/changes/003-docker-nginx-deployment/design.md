## Context

Ver `proposal.md` para la motivación general del despliegue en contenedor. Este diseño técnico detalla la arquitectura de construcción en múltiples etapas (*Multi-Stage Build*) y las directivas de configuración de Nginx para entregar la SPA Angular con máxima eficiencia y seguridad.

## Goals / Non-Goals

**Goals:**
- Implementar un `Dockerfile` Multi-Stage con Node.js 22 Alpine para la construcción y Nginx Alpine para la ejecución.
- Diseñar `nginx.conf` con enrutamiento de fallback SPA (`try_files $uri $uri/ /index.html;`), compresión gzip para texto/JS/CSS y control de caché.
- Crear `.dockerignore` para mantener limpio el contexto de construcción Docker.
- Lograr una imagen final de producción con un tamaño inferior a 35 MB.
- Asegurar que la imagen construida pueda probarse localmente en Docker Desktop.

**Non-Goals:**
- Terminación SSL/TLS dentro del contenedor (el proxy inverso de Dokploy / Traefik se encarga automáticamente de los certificados Let's Encrypt en el VPS).
- Empaquetado del backend o de la base de datos (están en su propio repositorio `vaster-focus-backend`).

## Decisions

### 1. Patrón Multi-Stage Build
- **Decisión:** Dividir el proceso de construcción en dos fases aisladas:
  ```text
  [Stage 1: node:22-alpine]
     pnpm install -> pnpm build -> dist/vaster-focus-frontend/browser
                                        │
                                        ▼ (copia solo los 9 archivos estáticos)
  [Stage 2: nginx:alpine]
     /usr/share/nginx/html <- dist/
     /etc/nginx/conf.d/default.conf <- nginx.conf
     EXPOSE 80
  ```
- **Por qué:** Evita que herramientas pesadas de compilación (`node`, `pnpm`, TypeScript, devDependencies de ~300 MB) permanezcan en la imagen que se ejecuta en el servidor. La imagen final solo contiene el binario compilado de Nginx y los estáticos HTML/JS/CSS.

### 2. Configuración de Nginx para Single Page Applications (SPA)
- **Decisión:** Toda solicitud que no coincida con un archivo estático real en disco debe responder con `/index.html`:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
- **Por qué:** En Angular, rutas como `/dashboard` son rutas lógicas del cliente. Sin esta directiva, al recargar la página en `/dashboard`, un servidor web normal devolvería error `404 Not Found`.

### 3. Compresión Gzip en Nginx
- **Decisión:** Habilitar compresión para `text/plain`, `text/css`, `application/json`, `application/javascript`, `text/xml`, `application/xml` e imágenes SVG.
- **Por qué:** Reduce el peso transferido por la red en más del 65%, logrando que la aplicación cargue en menos de 200 ms.

### 4. Estructura de Archivos en el Repositorio Frontend
```text
vaster-focus-frontend/
├── Dockerfile          # Definición Multi-Stage
├── nginx.conf          # Configuración del servidor Nginx
├── .dockerignore       # Filtros de exclusión de contexto
└── ...
```
