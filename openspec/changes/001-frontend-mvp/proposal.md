## Why

Para lograr un ambiente de estudio profundo (*deep work*) y concentración individual efectivo, se requiere una interfaz web inmersiva que absorba las distracciones externas (estética *true-black* / OLED y paneles translúcidos con *backdrop-blur*). Además, el temporizador Pomodoro debe ser inmune al estrangulamiento (*throttling*) de los navegadores cuando la pestaña pasa a segundo plano, y el mezclador de audio ambiental debe permitir combinar múltiples fuentes sonoras en simultáneo sin latencia ni interrupciones.

## What Changes

- **Inicialización de Aplicación Angular v20**: Configuración con Standalone Components exclusivos, Angular Signals y RxJS.
- **Integración de Tailwind CSS y Lucide Icons**: Configuración de tema oscuro profundo (OLED black), efectos de cristal (*glassmorphism*) y paquete `@lucide/angular`.
- **Componente Timer Flotante (`timer-widget`)**: Máquina de estados del temporizador Pomodoro con cálculo drift-free por timestamps y Web Worker, persistencia en `localStorage` y selector de modos (Trabajo 25/50m, Descanso corto 5/10m, Descanso largo 15m).
- **Mezclador de Audio Ambiental (`audio-mixer`)**: Motor nativo Web Audio API con canales independientes (Lofi, Lluvia, Fuego, Biblioteca), sliders de volumen por canal y mute general.
- **Checklist de Metas (`session-goals-widget`)**: Panel flotante para crear y tachar objetivos de la sesión en curso, sincronizado con `/api/goals`.
- **Capa de Fondo Dinámica (`ambient-background`)**: Contenedor modular para fondos en bucle (video WebM/MP4, imágenes de alta resolución y reproductor YouTube embebido sin interfaz).
- **Dashboard de Productividad (`productivity-dashboard`)**: Pantalla de métricas conectada a `/api/stats/daily` y `/api/stats/summary` con desglose diario en hora de Lima y visualizador de racha.

## Capabilities

### New Capabilities
- `timer-widget`: Temporizador Pomodoro flotante, drift-free, con estados reactivos y persistencia local.
- `audio-mixer`: Mezclador de audio ambiental multicanal con Web Audio API y controles de volumen independientes.
- `session-goals-widget`: Panel flotante de gestión de metas de la sesión activa.
- `ambient-background`: Capa de fondo inmersiva con soporte para imágenes, bucles de video y YouTube.
- `productivity-dashboard`: Vista de estadísticas, horas estudiadas y contador de racha en hora de Lima.

### Modified Capabilities
*(Ninguna, es la inicialización del frontend)*

## Impact

- **Nuevas Pantallas y Rutas**: Ruta `/` para la sala de estudio inmersiva (`SoloStudyComponent`) y ruta `/dashboard` para las estadísticas (`DashboardComponent`).
- **Dependencias**: Angular v20, `@lucide/angular`, Tailwind CSS, Web Audio API y cliente HTTP conectado a `http://localhost:3000/api`.
