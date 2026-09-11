# 🌌 Vaster Focus — Frontend Web

Aplicación web inmersiva para estudio profundo (*deep work*) y sesiones de concentración individual bajo la técnica Pomodoro, desarrollada con **Angular**, **Tailwind CSS** y **Lucide Icons** bajo la metodología **Spec-Driven Development (SDD)** con **OpenSpec**.

Inspirada en el modo *Solo Study* de plataformas como Study Together, diseñada con estética *true-black* / OLED gamer y paneles flotantes de cristal (*glassmorphism*).

---

## 🎯 Características Principales

### 1. ⏱️ Sala de Estudio Individual (*Solo Study Room*)
* **Temporizador Pomodoro Flotante:** Ciclos de Trabajo (*Work*), Descanso Corto (*Short Break*) y Descanso Largo (*Long Break*).
* **Precisión Drift-Free:** Temporizador inmune al estrangulamiento (*throttling*) de pestañas inactivas en navegadores mediante sincronización matemática de marcas temporales (`targetTimestamp - Date.now()`) y Web Workers.
* **Persistencia Reactiva:** Recuperación automática de la sesión activa ante cierres o recargas accidentales vía `localStorage`.

### 2. 🎧 Mezclador de Audio Ambiental Multicanal
* Mezcla simultánea de múltiples pistas ambientales (Lofi beats, Lluvia suave, Fuego de chimenea, Sonido de biblioteca, etc.).
* Deslizadores de volumen independientes por canal y botón de silencio (*mute*) maestro implementados con la **Web Audio API**.

### 3. 📝 Panel Flotante de Metas (*Session Goals*)
* Checklist interactivo para definir y tachar objetivos durante el bloque de estudio activo.
* Sincronización en tiempo real con la API del backend.

### 4. 🖼️ Capa de Fondos Dinámicos
* Soporte para fondos animados en bucle (video WebM/MP4, imágenes de alta definición estilo anime/café/naturaleza) y modo video de YouTube embebido sin distracciones (`controls=0`).

### 5. 📊 Dashboard de Productividad en Tiempo Real
* Visualización de horas estudiadas por día calendario proyectadas en la hora local del usuario (**`America/Lima` - UTC-5**).
* Contador de racha activa (*streak* de días consecutivos) y métricas de consistencia diaria.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Rol |
| :--- | :--- | :--- |
| **Framework** | **Angular (v20 Standalone)** | Arquitectura modular basada en componentes independientes. |
| **Reactividad** | **Angular Signals & RxJS** | Gestión reactiva de estados locales, flujos de audio y temporizadores. |
| **Estilos & UI** | **Tailwind CSS** | Estética oscura profunda (*vanta black*), utilidades y efectos `backdrop-blur`. |
| **Iconografía** | **Lucide Icons (`@lucide/angular`)** | Iconos minimalistas, consistentes y 100% código abierto. |
| **Audio** | **Web Audio API** | Motor nativo de ganancia y reproducción multicanal sin dependencias pesadas. |
| **Metodología** | **OpenSpec (`@fission-ai/openspec`)** | Especificaciones de componentes y máquinas de estado en `specs/`. |

---

## 📂 Arquitectura del Proyecto

```text
vaster-focus-frontend/
├── openspec/                   # Especificaciones de interfaz y estados SDD
├── src/
│   ├── app/
│   │   ├── core/               # Lógica pura (modelos, servicios HTTP, guardias)
│   │   │   ├── services/       # TimerService, AudioMixerService, ApiService
│   │   │   └── models/         # Interfaces tipadas de sesiones y metas
│   │   ├── features/           # Módulos de funcionalidad
│   │   │   ├── solo-study/     # Pantalla inmersiva de concentración
│   │   │   │   ├── components/ # TimerWidget, AudioMixer, GoalsChecklist, BackgroundLayer
│   │   │   │   └── solo-study.component.ts
│   │   │   └── dashboard/      # Vista de estadísticas, heatmap y gráficas
│   │   │       └── dashboard.component.ts
│   │   ├── shared/             # Componentes reutilizables (modales, sliders, botones)
│   │   ├── app.routes.ts       # Enrutamiento de la aplicación
│   │   └── app.config.ts       # Configuración Standalone de Angular
│   ├── assets/                 # Sonidos ambientales y fondos predeterminados
│   └── styles.css              # Directivas base de Tailwind CSS
├── tailwind.config.js          # Configuración de paleta oscura y efectos
├── package.json
└── tsconfig.json
```

---

## 🚀 Puesta en Marcha (Desarrollo Local)

### 1. Instalar Dependencias
```bash
pnpm install
```

### 2. Iniciar Servidor de Desarrollo
```bash
pnpm start
```
La aplicación estará disponible en `http://localhost:4200`.

### 3. Compilar para Producción
```bash
pnpm build
```
