## 1. Configuración de Nginx para Producción

- [ ] 1.1 Crear `nginx.conf` en la raíz de `vaster-focus-frontend` con enrutamiento SPA (`try_files $uri $uri/ /index.html;`), compresión `gzip` y directivas de caché para activos inmutables

## 2. Contexto de Construcción de Docker

- [ ] 2.1 Crear `.dockerignore` excluyendo `node_modules`, `.git`, `dist`, `.angular` y archivos de prueba

## 3. Implementación del Dockerfile Multi-Stage

- [ ] 3.1 Implementar `Dockerfile` con Stage 1 de compilación (`node:22-alpine` + `pnpm build`) y Stage 2 de ejecución (`nginx:alpine` + copia de estáticos y `nginx.conf`)

## 4. Verificación y Validación OpenSpec

- [ ] 4.1 Validar la conformidad del cambio con `pnpm exec openspec validate 003-docker-nginx-deployment`
- [ ] 4.2 Construir la imagen Docker localmente (`docker build -t vaster-focus-frontend .`) y verificar compilación limpia
- [ ] 4.3 Ejecutar el contenedor localmente y comprobar entrega de `index.html` en el puerto 8080
