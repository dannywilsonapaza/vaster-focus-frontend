## Why

Actualmente, la sala de estudio (Solo Study) solo dispone de 4 fondos estáticos basados en gradientes CSS oscuros. Para alcanzar una experiencia inmersiva profunda similar a plataformas de referencia como *Study Together* o *LifeAt*, los usuarios necesitan poder estudiar con entornos visuales dinámicos: videos relajantes de YouTube (lofi, cafeterías ASMR, bibliotecas), imágenes estáticas de alta calidad o GIFs animados en bucle, además de mantener la estética minimalista OLED Pure Black y la legibilidad absoluta de los widgets.

## What Changes

- **Soporte de Fondos en 3 Tipos + OLED**:
  - **Imágenes estáticas**: Fondos WebP/fotográficos curados de alta resolución y soporte de URL externa.
  - **Dinámicos / GIFs**: Animaciones sutiles y GIFs en bucle relajantes con presets curados y URL externa.
  - **Videos de YouTube**: Integración mediante reproductor `<iframe>` embebido sin distracciones (`controls=0`, `loop=1`, `pointer-events-none`) que actúa como fondo a pantalla completa sin consumir cuota de transferencia de Vercel.
  - **OLED / Gradientes**: Preservación de la paleta actual True Black y degradados sutiles.
- **Control de Audio para YouTube**: El video embebido inicia silenciado por defecto para cumplir con las políticas de autoplay del navegador, pero ofrece un control de volumen / desmuteo en el selector para quienes deseen escuchar el audio ambiental del video.
- **Atenuador de Oscurecimiento (Overlay Dimmer)**:
  - Sin oscurecimiento por defecto (0% opacidad).
  - Control deslizante (*slider*) que permite al usuario ajustar la capa oscura de 0% a 50% de opacidad para adaptar el contraste según la luminosidad del fondo.
  - Conservación de la estética de cristal esmerilado (`backdrop-blur-xl`, esquinas redondeadas `rounded-2xl` y bordes sutiles) en todos los widgets para asegurar total legibilidad en cualquier nivel de atenuación.
- **Selector Popover Compacto**:
  - Menú popover desplegable y compacto anclado al botón superior de la barra de herramientas.
  - Pestañas organizadas por categoría: *Estáticos*, *Dinámicos/GIFs*, *YouTube*, *OLED/Color*.
  - Cuadrícula de miniaturas para selección rápida en un clic.
  - Formulario integrado para ingresar enlaces personalizados (YouTube, imagen o GIF).
- **Persistencia en LocalStorage**:
  - Almacenamiento del fondo activo actual.
  - Almacenamiento del nivel de oscurecimiento preferido.
  - Historial de fondos personalizados recientes guardados por el usuario.

## Capabilities

### New Capabilities
- `ambient-background`: Gestión y renderizado de ambientación visual inmersiva con fondos estáticos, GIFs/dinámicos, videos de YouTube a pantalla completa, atenuador de opacidad (0%-50%), selector popover compacto y persistencia en almacenamiento local.

### Modified Capabilities
<!-- No existen especificaciones principales previas sincronizadas -->

## Impact

- **Componentes Frontend**:
  - Refactorización de `BackgroundLayerComponent` (`src/app/features/solo-study/components/background-layer.component.ts` y `.html`) para soportar renderizado de imágenes, GIFs, iframes de YouTube con `DomSanitizer` y la capa atenuadora regulable.
  - Creación/actualización del componente de selección de fondos en la barra de herramientas de `SoloStudyComponent`.
  - Servicio o store de estado para persistencia de fondos y configuración de opacidad en `localStorage`.
- **Dependencias**: Utiliza `@lucide/angular` existente y Angular Signals (`signal`, `computed`). No requiere librerías externas pesadas.
