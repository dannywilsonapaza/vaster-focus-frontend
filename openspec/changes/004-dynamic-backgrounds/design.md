## Context

Actualmente `BackgroundLayerComponent` solo maneja gradientes CSS locales y clases fijas (`BackgroundPreset`). Para soportar la nueva experiencia multimedia multiformato (imágenes estáticas, GIFs en bucle y videos de YouTube embebidos a pantalla completa), se requiere desacoplar el estado y persistencia en un servicio reactivo dedicado (`BackgroundService`) e implementar renderizado condicional optimizado en el componente de fondo.

## Goals / Non-Goals

**Goals:**
- Proporcionar renderizado fluido a pantalla completa de 4 tipos de fondo: imágenes estáticas, GIFs, videos embebidos de YouTube y gradientes OLED.
- Asegurar consumo de datos cero en Vercel mediante streaming cliente-a-servidor directo desde YouTube/CDNs.
- Ofrecer un menú popover desplegable y compacto anclado al botón superior, con navegación por pestañas (*Estáticos*, *Dinámicos*, *YouTube*, *OLED*) y miniaturas.
- Proveer un atenuador de oscurecimiento (deslizador continuo de 0% a 50%, 0% por defecto) y asegurar que los widgets mantengan máxima legibilidad con `backdrop-blur-xl` y bordes redondeados.
- Persistir la configuración activa y el historial de enlaces personalizados en `localStorage`.

**Non-Goals:**
- Alojar archivos pesados de video `.mp4` en el bundle de la aplicación o en Vercel.
- Proveer un editor de recorte o manipulación de imágenes en el cliente.
- Descargar videos de YouTube localmente o evadir las políticas de uso de la API de YouTube.

## Decisions

### 1. Modelo de Datos Polimórfico para Fondos
- **Decisión**: Definir una interfaz `BackgroundItem` con discriminador `type: 'color' | 'image' | 'gif' | 'youtube'`, con propiedades para `id`, `name`, `category`, `sourceUrl`, `thumbnailUrl`, `accentColor`, y opcionalmente `youtubeId`.
- **Alternativas consideradas**: Crear componentes separados para cada tipo de fondo. Se descartó porque agrega complejidad de orquestación innecesaria frente a un único `BackgroundLayerComponent` con bloques `@switch (background.type)`.

### 2. Integración de YouTube vía Iframe Embebido con CSS Cover
- **Decisión**: Usar un `<iframe>` apuntando a `https://www.youtube.com/embed/{id}?autoplay=1&mute=1&controls=0&loop=1&playlist={id}&modestbranding=1&enablejsapi=1` sanitizado mediante `DomSanitizer.bypassSecurityTrustResourceUrl`. Para lograr el comportamiento `object-fit: cover` sin franjas negras:
  ```css
  pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[56.25vw] min-h-full min-w-[177.77vh]
  ```
  y `pointer-events-none` para evitar que los clics del usuario en los widgets interfieran con el video.
- **Alternativas consideradas**: Usar reproductor HTML5 `<video>` nativo. Descartado porque requeriría descargar y alojar archivos MP4/WebM pesados, agotando el límite mensual de Vercel.

### 3. Control de Audio para YouTube Embebido
- **Decisión**: Iniciar siempre silenciado (`mute=1`) para garantizar que el navegador permita la reproducción automática. El popover de configuración incluirá un botón toggle de mute y un control de volumen que interactúa con la API de Iframe de YouTube vía `postMessage` (`{"event":"command","func":"unMute"}` / `{"event":"command","func":"setVolume","args":[val]}`).
- **Alternativas consideradas**: Cargar el script pesado de la API oficial de YouTube (`iframe_api`). Se prefiere `postMessage` nativo por ser inmediato, sin dependencias externas bloqueantes y sin overhead de scripts.

### 4. Capa Atenuadora y Estética de Widgets
- **Decisión**: Colocar un `div` absoluto superpuesto con `pointer-events-none` y estilo reactivo `[style.background-color]="'rgba(0, 0, 0, ' + (darknessOpacity() / 100) + ')'"` donde `darknessOpacity` es un Signal con rango `[0, 50]`. Los widgets flotantes conservan `backdrop-blur-xl`, `bg-black/75` (o `bg-black/60`) y `rounded-2xl` para contraste impecable incluso con 0% de atenuación.
- **Alternativas consideradas**: Filtrar el video con `filter: brightness()`. Se descartó porque `filter` en navegadores degrada el rendimiento de renderizado por GPU en videos de alta resolución comparado con una simple capa semitransparente.

### 5. Arquitectura del Servicio `BackgroundService`
- **Decisión**: Crear `BackgroundService` como un servicio `@Injectable({ providedIn: 'root' })` con Angular Signals (`activeBackground`, `darknessLevel`, `customBackgrounds`, `isAudioMuted`, `volume`). La inicialización lee desde `localStorage` y cada cambio se guarda automáticamente mediante `effect()`.

## Risks / Trade-offs

- **[Riesgo: Videos de YouTube no disponibles o restringidos]** → *Mitigación:* Validación del ID o URL al momento de guardado; si falla la carga o el video fue eliminado por el autor, fallback automático al modo seguro `OLED Pure Black`.
- **[Riesgo: Bloqueo de URLs por seguridad en Angular (XSS)]** → *Mitigación:* Uso exclusivo de `DomSanitizer.bypassSecurityTrustResourceUrl` en URLs controladas de YouTube con sanitización regex del ID del video (`[a-zA-Z0-9_-]{11}`).
- **[Riesgo: Parpadeo en cambio de fondo]** → *Mitigación:* Transiciones CSS sutiles de opacidad (`transition-opacity duration-700`) entre cambios de estado.
