## Context

Ver `proposal.md` para la motivación general del frontend. Este diseño técnico establece la arquitectura de componentes Standalone en Angular v20, la gestión de reactividad con Signals y RxJS, y la integración de Tailwind CSS y Web Audio API.

## Goals / Non-Goals

**Goals:**
- Configurar Angular v20 con Standalone Components exclusivos (cero `NgModule`) y estrategia `ChangeDetectionStrategy.OnPush`.
- Estructurar la arquitectura modular en `core/` (servicios HTTP, modelos, workers), `features/` (`solo-study`, `dashboard`) y `shared/` (componentes UI base).
- Implementar `TimerService` con Angular Signals y cálculo drift-free basado en timestamps (`targetTimestamp - Date.now()`).
- Implementar `AudioMixerService` utilizando la Web Audio API con un bus maestro de ganancia y canales individuales en bucle.
- Diseñar la interfaz gráfica inmersiva estilo Study Together con Tailwind CSS (paleta *true-black* OLED, paneles flotantes con `backdrop-blur-md`, bordes translúcidos y Lucide Icons).
- Implementar `DashboardComponent` para consumir `/api/stats/daily` y `/api/stats/summary` y renderizar gráficos de rendimiento.

**Non-Goals:**
- Chat en vivo o salas colaborativas con WebRTC/WebSockets (reservado para fases multiusuario posteriores).
- Soporte para streaming de Spotify o servicios de música de terceros bajo DRM.

## Decisions

### 1. Arquitectura de Componentes Standalone y Árbol de UI
```text
src/app/
├── core/
│   ├── services/
│   │   ├── timer.service.ts        # Máquina de estados Pomodoro + Web Worker
│   │   ├── audio-mixer.service.ts  # Web Audio API (MasterGain, TrackGain)
│   │   └── api.service.ts          # Comunicación HTTP tipada con backend
│   └── models/
│       ├── session.model.ts
│       ├── goal.model.ts
│       └── stats.model.ts
├── features/
│   ├── solo-study/
│   │   ├── components/
│   │   │   ├── timer-widget/
│   │   │   ├── audio-mixer-widget/
│   │   │   ├── goals-widget/
│   │   │   └── background-layer/
│   │   └── solo-study.component.ts # Vista principal de estudio
│   └── dashboard/
│       ├── components/
│       │   ├── stat-card/
│       │   └── daily-chart/
│       └── dashboard.component.ts  # Vista de métricas
└── shared/
    └── components/                 # Botones, modales, sliders reutilizables
```

### 2. Motor del Temporizador Drift-Free (`TimerService`)
- **Decisión:** Al presionar "Play", se calcula el timestamp absoluto de finalización:
  ```typescript
  this.targetTimestamp = Date.now() + this.remainingSeconds() * 1000;
  ```
  Un Web Worker emite pulsos cada segundo. Al recibir cada pulso (o al dispararse el evento `visibilitychange` de la página al volver a la pestaña), se recomputa:
  ```typescript
  const diff = Math.max(0, Math.ceil((this.targetTimestamp - Date.now()) / 1000));
  this.remainingSeconds.set(diff);
  ```
- **Por qué:** Los navegadores estrangulan `setInterval` a 1 tick por minuto en pestañas inactivas. Este cálculo de delta matemático garantiza cero desfase temporal.

### 3. Motor de Audio Multicanal (`AudioMixerService`)
- **Decisión:** Crear un único `AudioContext` nativo inicializado en el primer clic del usuario (para cumplir con la política de autoplay del navegador).
- **Estructura de nodos de audio:**
  `AudioSource (BufferSource / HTMLAudio)` ➔ `TrackGainNode` ➔ `MasterGainNode` ➔ `AudioContext.destination`.
- **Ventaja:** Cero dependencias pesadas (como Howler o reproductores externos); soporte nativo para volumen individual, desvanecimiento (*fade in/out*) y mute maestro instantáneo.

### 4. Estilos Tailwind CSS y Tema OLED
- Paleta:
  - Fondo primario: `#09090b` (Zinc-950) / `#000000` (True Black)
  - Superficies flotantes: `bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl`
  - Acentos: Ámbar / Naranja fuego para rachas (`#f97316`), Verde esmeralda para completado (`#10b981`), Violeta sutil para descansos (`#8b5cf6`).

## Risks / Trade-offs

- **[Riesgo] Política de Autoplay en Navegadores** -> *Mitigación:* Los audios inician pausados y el `AudioContext` se reactiva con el primer clic del usuario en "Play" o al activar cualquier pista en el mixer.
- **[Riesgo] Consumo de memoria con bucles de video pesados** -> *Mitigación:* Se usan videos cortos WebM de menos de 5MB o fondos estáticos WebP de alta definición.
