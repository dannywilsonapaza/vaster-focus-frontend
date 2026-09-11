# AGENTS.md — Frontend Web

## Project Scope
Aplicación web inmersiva para estudio profundo (Solo Study) y Pomodoro.
- Stack: Angular (v20 Standalone Components), Tailwind CSS, Lucide Icons (`@lucide/angular`), Web Audio API, OpenSpec.
- Package Manager: `pnpm`

## Golden Rules
1. COMPONENT ARCHITECTURE: Usar exclusivamente Standalone Components (evitar `NgModule`).
2. REACTIVITY: Priorizar Angular Signals para estado local y reactivo del UI, y RxJS para flujos asíncronos y streams de audio multicanal.
3. TIMER PRECISION: El temporizador no debe depender de un `setInterval` vulnerable a throttling de pestaña inactiva; calcular el tiempo transcurrido por diferencia de timestamps (`targetTime - Date.now()`) o Web Worker.
4. UI/STYLING: Usar exclusivamente clases utilitarias de Tailwind CSS con paleta oscura profunda (OLED / true black) y efectos `backdrop-blur`. No instalar PrimeNG ni frameworks de diseño pesados.
5. ICONS: Usar `@lucide/angular` para toda la iconografía.
6. ISOLATION: No invadir ni modificar archivos en `../vaster-focus-backend`.

## Setup & Dev Commands
- Instalar dependencias: `pnpm install`
- Servidor de desarrollo: `pnpm start` (puerto 4200)
- Build: `pnpm build`
- Tests: `pnpm test`
