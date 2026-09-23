## Why

Para permitir el despliegue autónomo, reproducible y de alto rendimiento del frontend de Vaster Focus en la nube (VPS con Dokploy o cualquier orquestador de contenedores), se requiere empaquetar la aplicación Angular en un contenedor Docker optimizado para producción. 

Como el frontend es un Polirepo desacoplado del backend, debe ser capaz de compilarse y servirse por sí mismo sin depender del código de la API. Servir la aplicación como estáticos ligeros mediante Nginx Alpine garantiza un consumo mínimo de memoria RAM (< 20 MB), transferencias aceleradas por compresión gzip y compatibilidad total con el enrutamiento SPA de Angular.

## What Changes

- **Servidor Web Nginx (`nginx.conf`)**: Configuración personalizada de Nginx con enrutamiento SPA (`try_files $uri $uri/ /index.html;`), compresión gzip activa y cabeceras de caché para activos inmutables.
- **Empaquetado Multi-Stage (`Dockerfile`)**:
  - *Etapa 1 (Build)*: Imagen `node:22-alpine` con `pnpm` para instalar dependencias y ejecutar `pnpm build` de producción.
  - *Etapa 2 (Runtime)*: Imagen `nginx:alpine` para alojar los archivos compilados en `/usr/share/nginx/html` y exponer el puerto 80.
- **Contexto de Construcción (`.dockerignore`)**: Exclusión rigurosa de `node_modules`, `.angular`, `.git`, `dist` y archivos de prueba para optimizar la velocidad de construcción y la seguridad.

## Capabilities

### New Capabilities
- `container-deployment`: Empaquetado y entrega de la aplicación web en contenedor Docker autónomo con servidor Nginx optimizado.

### Modified Capabilities
*(Ninguna)*

## Impact

- **Autonomía en Dokploy**: El repositorio `vaster-focus-frontend` puede conectarse directamente a Dokploy como un servicio independiente.
- **Rendimiento Máximo**: Imagen de producción ultraligera (~25-30 MB) con entrega en milisegundos y soporte para recarga directa en cualquier ruta (ej: `/dashboard`).
