## Context

Ver `proposal.md` para la justificación general del cambio. Este diseño técnico formaliza la estrategia de transporte HTTP entre el cliente Angular y el backend Node.js Express, tanto para la fase de desarrollo interactivo como para el despliegue productivo en contenedores Docker / Dokploy.

## Goals / Non-Goals

**Goals:**
- Implementar los archivos de configuración de entorno tipados en `src/environments/`.
- Crear el archivo de proxy `proxy.conf.json` apuntando al backend en `http://localhost:3000`.
- Configurar `angular.json` para asociar el proxy al comando `pnpm start` (`ng serve`) y el reemplazo de archivos en `pnpm build` (`ng build --configuration production`).
- Refactorizar `ApiService` para consumir `environment.apiUrl` manteniendo la compatibilidad total con los widgets existentes.
- Garantizar que la compilación de producción (`pnpm build`) continúe exitosa sin errores de bundle ni advertencias.

**Non-Goals:**
- Interceptores HTTP de autenticación JWT o refresco de tokens (reservado para la fase multiusuario).
- Caché offline o interceptores de reintento exponencial (reservado para la fase PWA con Service Worker).

## Decisions

### 1. Enrutamiento Relativo Unificado (`/api`)
- **Decisión:** `ApiService` siempre construirá sus URLs relativas con base en `/api` (ej: `/api/goals`, `/api/sessions`, `/api/stats`).
- **Por qué:**
  - En **Desarrollo**: El dev-server de Angular escucha en `http://localhost:4200` e intercepta cualquier ruta con prefijo `/api` gracias a `proxy.conf.json`, reenviándola a `http://localhost:3000/api`. El navegador interpreta que todo ocurre en el mismo host, eliminando peticiones preflight CORS.
  - En **Producción**: El servidor web Nginx que entrega los estáticos de Angular incluye la regla `location /api/ { proxy_pass http://backend:3000/api/; }`. Por tanto, el frontend usa exactamente la misma ruta relativa sin tocar una sola línea de código.

### 2. Estructura de Archivos de Entorno
```typescript
// src/environments/environment.ts (Desarrollo)
export const environment = {
  production: false,
  apiUrl: '/api',
};

// src/environments/environment.prod.ts (Producción)
export const environment = {
  production: true,
  apiUrl: '/api',
};
```

### 3. Configuración del Proxy en `proxy.conf.json`
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### 4. Modificaciones en `angular.json`
- En `projects.vaster-focus-frontend.architect.serve.options`:
  ```json
  "proxyConfig": "proxy.conf.json"
  ```
- En `projects.vaster-focus-frontend.architect.build.configurations.production`:
  ```json
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ]
  ```

### 5. Consumo en `ApiService`
```typescript
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  // ... resto del servicio sin cambios en contratos ni firmas
}
```
