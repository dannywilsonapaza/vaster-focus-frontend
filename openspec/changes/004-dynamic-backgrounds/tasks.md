## 1. Modelo de Datos y Servicio Reactivo de Fondos

- [x] 1.1 Definir el modelo TypeScript `BackgroundItem`, categorías (`static`, `gif`, `youtube`, `color`) y el catálogo curado de presets con miniaturas verificando compilación de tipos
- [x] 1.2 Implementar `BackgroundService` gestionando con Angular Signals el fondo activo, el nivel de atenuación (0%-50%), control de mute de audio y persistencia en `localStorage`
- [x] 1.3 Implementar utilitarios de extracción de ID de YouTube (formatos `youtu.be/` y `youtube.com/watch?v=`), sanitización segura con `DomSanitizer` y gestión de fondos personalizados recientes

## 2. Capa de Renderizado Multimedia (Background Layer)

- [x] 2.1 Refactorizar `BackgroundLayerComponent` (`.ts` y `.html`) para renderizar condicionalmente imágenes `<img>`, GIFs animados, `<iframe>` de YouTube a pantalla completa (`pointer-events-none`) y gradientes OLED
- [x] 2.2 Integrar capa de oscurecimiento superpuesta reactiva con opacidad de 0% a 50% regulada por el servicio y verificar preservación del estilo glassmorphism en los widgets

## 3. Selector Popover de Fondos en la Barra de Herramientas

- [x] 3.1 Construir el componente popover compacto `BackgroundSelectorComponent` anclado al botón superior, con navegación por pestañas de categorías y cuadrícula de tarjetas con miniaturas
- [x] 3.2 Implementar el control deslizante (*slider*) de atenuación (0% a 50%) y el toggle de sonido/volumen para videos de YouTube dentro del popover
- [x] 3.3 Implementar el formulario para pegar URLs o enlaces personalizados (YouTube, imagen o GIF), agregando validación y acceso rápido a fondos recientes
- [x] 3.4 Conectar el nuevo selector en la barra superior de `SoloStudyComponent` reemplazando el dropdown anterior y asegurando cierre al hacer clic fuera

## 4. Validación y Compilación

- [x] 4.1 Ejecutar `pnpm build` para verificar que no existan errores de tipos ni advertencias en la compilación de producción de Angular
- [x] 4.2 Validar el ciclo completo: cambio dinámico entre formatos, persistencia al recargar página y comportamiento sin bloqueo de interacción en los widgets
