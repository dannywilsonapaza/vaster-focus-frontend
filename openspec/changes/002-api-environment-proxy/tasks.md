## 1. Definición de Entornos de Angular

- [ ] 1.1 Crear `src/environments/environment.ts` con configuración para desarrollo (`production: false`, `apiUrl: '/api'`)
- [ ] 1.2 Crear `src/environments/environment.prod.ts` con configuración para producción (`production: true`, `apiUrl: '/api'`)

## 2. Configuración del Proxy de Desarrollo

- [ ] 2.1 Crear `proxy.conf.json` en la raíz de `vaster-focus-frontend` con regla `/api` apuntando a `http://localhost:3000` con `changeOrigin: true`
- [ ] 2.2 Configurar `angular.json` en `projects.vaster-focus-frontend.architect.serve.options` para vincular `"proxyConfig": "proxy.conf.json"`

## 3. Configuración de Reemplazo para Producción

- [ ] 3.1 Configurar `fileReplacements` en `angular.json` dentro de `architect.build.configurations.production` para sustituir `environment.ts` por `environment.prod.ts`

## 4. Refactorización de ApiService

- [ ] 4.1 Actualizar `src/app/core/services/api.service.ts` importando `environment` y asignando `private readonly baseUrl = environment.apiUrl;`

## 5. Verificación y Validación OpenSpec

- [ ] 5.1 Ejecutar `pnpm build` para verificar la compilación estricta y el reemplazo de archivos sin errores
- [ ] 5.2 Validar la conformidad del cambio con `openspec validate 002-api-environment-proxy`
