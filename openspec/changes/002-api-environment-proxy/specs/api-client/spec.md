## Purpose

Gestiona la capa transversal de configuración de transporte HTTP y conectividad con el backend de Vaster Focus, asegurando resolución de endpoints por entorno y enrutamiento transparente en desarrollo y producción.

## ADDED Requirements

### Requirement: Resolución de URL base por entorno
EL SISTEMA SHALL resolver la URL base de la API a través de los archivos de entorno de Angular (`src/environments/environment.ts` para desarrollo y `src/environments/environment.prod.ts` para producción).

#### Scenario: Compilación para desarrollo local
- **CUANDO** la aplicación se ejecuta con `pnpm start`
- **ENTONCES** `ApiService` utiliza el valor de `environment.apiUrl` configurado como `/api`

#### Scenario: Compilación para producción
- **CUANDO** se ejecuta la compilación de producción con `pnpm build`
- **ENTONCES** Angular reemplaza `src/environments/environment.ts` por `src/environments/environment.prod.ts` mediante `fileReplacements`

### Requirement: Proxy de desarrollo para desvío de peticiones
EL SISTEMA SHALL reenviar automáticamente todas las peticiones dirigidas al prefijo `/api` hacia el backend local en ejecución (`http://localhost:3000`) a través de `proxy.conf.json`.

#### Scenario: Solicitud HTTP de recursos en desarrollo
- **CUANDO** el cliente solicita `/api/goals` desde el navegador en `http://localhost:4200`
- **ENTONCES** el servidor de desarrollo de Angular redirige la solicitud a `http://localhost:3000/api/goals` de forma transparente y sin bloqueo de CORS

### Requirement: Consumo desacoplado en servicios de datos
EL SISTEMA SHALL garantizar que `ApiService` no contenga URLs absolutas ni puertos de red fijados en el código.

#### Scenario: Inicialización de ApiService
- **MIENTRAS** `ApiService` esté instanciado en el inyector de dependencias
- **EL SISTEMA SHALL** componer las rutas de sesiones, metas y estadísticas a partir del valor inyectado desde `environment.apiUrl`
