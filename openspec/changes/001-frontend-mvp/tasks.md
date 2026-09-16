## 1. Scaffolding y Configuración de Dependencias

- [x] 1.1 Inicializar la aplicación Angular con Standalone Components activos y configurar `package.json` con `pnpm`
- [x] 1.2 Configurar Tailwind CSS con soporte para modo oscuro OLED y directivas en `src/styles.css`
- [x] 1.3 Instalar y configurar `@lucide/angular` con los iconos requeridos para timer, mixer y metas
- [x] 1.4 Configurar el enrutamiento base en `src/app/app.routes.ts` (`/` para `SoloStudyComponent`, `/dashboard` para `DashboardComponent`)

## 2. Servicios del Núcleo (Core Services)

- [x] 2.1 Implementar `src/app/core/services/api.service.ts` con cliente HTTP tipado para sesiones, metas y estadísticas
- [x] 2.2 Implementar `src/app/core/services/timer.service.ts` con máquina de estados reactiva con Signals, cálculo drift-free por timestamps y persistencia en `localStorage`
- [x] 2.3 Implementar `src/app/core/services/audio-mixer.service.ts` con Web Audio API, nodos GainNode por pista y MasterGainNode

## 3. Componentes de la Sala de Estudio (Solo Study Room)

- [x] 3.1 Implementar `BackgroundLayerComponent` con soporte para fondos de video WebM en bucle, imágenes y video embebido
- [x] 3.2 Implementar `TimerWidgetComponent` con controles Play, Pause, Reset, visualización HH:MM:SS y selector de modos (Work, Short Break, Long Break)
- [x] 3.3 Implementar `AudioMixerWidgetComponent` con panel flotante de pistas (Lofi, Lluvia, Fuego, Biblioteca), sliders de ganancia y mute maestro
- [x] 3.4 Implementar `GoalsWidgetComponent` con input de adición, lista interactiva de casillas, contador abierto/completado y sincronización con `ApiService`
- [x] 3.5 Ensamblar `SoloStudyComponent` con layout a pantalla completa y estética translúcida *backdrop-blur*

## 4. Componentes del Dashboard de Productividad

- [x] 4.1 Implementar `StatCardComponent` para renderizar tarjetas de resumen (Racha, Tiempo Hoy, Promedio)
- [x] 4.2 Implementar `DailyChartComponent` para renderizar el gráfico de barras con horas de estudio por día en hora de Lima
- [x] 4.3 Ensamblar `DashboardComponent` conectando los datos de `/api/stats/daily` y `/api/stats/summary` con `ChangeDetectionStrategy.OnPush`

## 5. Verificación y Calidad

- [x] 5.1 Ejecutar `pnpm build` para verificar compilación estricta de Angular sin errores de tipado
- [x] 5.2 Validar la conformidad del cambio con `openspec validate 001-frontend-mvp`
