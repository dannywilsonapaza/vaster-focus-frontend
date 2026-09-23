## Why

Actualmente, `ApiService` tiene codificada de forma fija la URL absoluta `http://localhost:3000/api` en el código fuente. Esto presenta tres desventajas críticas:
1. Acopla el código a un host y puerto específico de desarrollo.
2. Impide compilar limpiamente para producción sin modificar el código a mano.
3. Depende enteramente de cabeceras CORS en el servidor, generando solicitudes preflight `OPTIONS` innecesarias.

Se requiere desacoplar la resolución de URLs mediante archivos de configuración de entorno oficiales de Angular (`environment.ts` / `environment.prod.ts`) y configurar un proxy inverso de desarrollo (`proxy.conf.json`) en Angular CLI que redirija transparentemente las llamadas `/api` hacia el backend en el puerto `3000`.

## What Changes

- **Archivos de Entorno de Angular**: Creación de `src/environments/environment.ts` (desarrollo, `apiUrl: '/api'`) y `src/environments/environment.prod.ts` (producción, `apiUrl: '/api'`).
- **Proxy de Desarrollo**: Creación de `proxy.conf.json` en la raíz del proyecto frontend para reenviar peticiones `/api` a `http://localhost:3000`.
- **Configuración de Angular CLI (`angular.json`)**:
  - Inclusión de `"proxyConfig": "proxy.conf.json"` en la sección `serve.options`.
  - Configuración de `"fileReplacements"` en `architect.build.configurations.production` para sustituir el archivo de entorno en compilaciones de producción.
- **Refactorización de `ApiService`**: Sustitución de la URL hardcodeada por `environment.apiUrl`.

## Capabilities

### New Capabilities
- `api-client`: Capa transversal de configuración de transporte HTTP, resolución de endpoints por entorno y proxy de desarrollo.

### Modified Capabilities
*(Ninguna)*

## Impact

- **Desacoplamiento Total**: El cliente Angular ya no contiene IPs, dominios ni puertos fijos en el código.
- **Desarrollo sin Fricción CORS**: El dev-server de Angular sirve la aplicación y el proxy bajo el mismo origen (`http://localhost:4200`), eliminando problemas de CORS.
- **Paridad con Producción**: La ruta relativa `/api` funciona de forma idéntica en entornos de producción orquestados con Nginx, Docker y Dokploy.
