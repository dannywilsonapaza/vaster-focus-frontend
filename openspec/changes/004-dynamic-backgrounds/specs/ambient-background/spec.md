## Purpose

Gestiona la ambientación visual inmersiva de la sala de estudio mediante el renderizado a pantalla completa de fondos estáticos, GIFs animados en bucle, videos embebidos de YouTube y gradientes OLED, con control de atenuación y persistencia de preferencias.

## ADDED Requirements

### Requirement: Renderizado de fondos multiformato
EL SISTEMA SHALL renderizar el fondo de pantalla en pantalla completa detrás de todos los widgets flotantes, soportando cuatro modalidades visuales: imágenes estáticas optimizadas, GIFs animados en bucle, videos de YouTube embebidos a pantalla completa con `pointer-events-none` y gradientes minimalistas OLED Pure Black.

#### Scenario: Selección de video de YouTube
- **WHEN** el usuario selecciona un fondo de video de YouTube del catálogo de presets
- **THEN** EL SISTEMA renderiza un reproductor embebido sin controles (`controls=0`), en bucle infinito (`loop=1`) y sin bloquear la interacción con los widgets de la sala de estudio.

#### Scenario: Selección de imagen o GIF animado
- **WHEN** el usuario selecciona una imagen estática o un GIF animado
- **THEN** EL SISTEMA aplica la imagen cubriendo la totalidad de la pantalla con relación de aspecto preservada (`object-cover`) sin recargar la página.

#### Scenario: Selección de fondo OLED
- **WHEN** el usuario elige el preset "OLED Pure Black" o gradientes sutiles
- **THEN** EL SISTEMA renderiza el color o gradiente oscuro correspondiente con las animaciones de brillo ambiental sutil.

### Requirement: Control de audio para videos de YouTube
EL SISTEMA SHALL silenciar automáticamente (`mute=1`) los videos de YouTube al momento de su carga inicial para cumplir con las políticas de reproducción automática de los navegadores, y SHALL proporcionar un control en la interfaz para permitir al usuario activar o graduar el sonido del fondo cuando lo desee.

#### Scenario: Carga inicial de video
- **WHEN** se carga un fondo de YouTube por primera vez o se cambia a un nuevo video
- **THEN** el video comienza a reproducirse inmediatamente sin emitir sonido.

#### Scenario: Activación de sonido por el usuario
- **WHEN** el usuario hace clic en el control de sonido dentro del menú del fondo
- **THEN** el reproductor de YouTube activa el audio ambiental del video al volumen configurado.

### Requirement: Atenuador de oscurecimiento regulable
EL SISTEMA SHALL superponer una capa oscura transparente entre el fondo multimedia y los widgets flotantes, con una opacidad por defecto de 0% (sin oscurecimiento), y SHALL permitir su regulación continua mediante un control deslizante desde 0% hasta un máximo de 50%.

#### Scenario: Ajuste del nivel de opacidad
- **WHEN** el usuario desplaza el control deslizante de atenuación al 35%
- **THEN** la capa oscura ajusta de inmediato su opacidad al 35%, incrementando el contraste detrás de los widgets flotantes.

#### Scenario: Estado por defecto
- **WHEN** el usuario no ha modificado la opacidad o la restablece
- **THEN** la capa oscura se mantiene en 0% de opacidad sin oscurecer la viveza del fondo original.

### Requirement: Selector popover compacto y categorizado
EL SISTEMA SHALL proporcionar un menú desplegable compacto anclado al botón superior de fondos, organizado mediante pestañas de categorías ("Estáticos", "Dinámicos", "YouTube", "OLED"), que presente una cuadrícula de tarjetas con miniaturas y visualización del elemento activo.

#### Scenario: Navegación entre pestañas de fondos
- **WHEN** el usuario hace clic en la pestaña "YouTube" del popover
- **THEN** EL SISTEMA despliega las miniaturas de los videos relajantes preconfigurados (Lofi, Lluvia, Cafetería, Biblioteca).

#### Scenario: Apertura y cierre del selector
- **WHEN** el usuario hace clic en el botón de fondos de la barra superior o fuera del menú desplegado
- **THEN** el popover se abre o cierra de forma reactiva sin interrumpir el temporizador ni los sonidos en curso.

### Requirement: Entrada y gestión de fondos personalizados
EL SISTEMA SHALL permitir al usuario ingresar URLs externas personalizadas para imágenes, GIFs o videos/IDs de YouTube, validando el formato y añadiéndolos a una lista de enlaces recientes para su posterior reutilización.

#### Scenario: Ingreso de enlace de YouTube válido
- **WHEN** el usuario pega una URL de YouTube válida (ej. `https://www.youtube.com/watch?v=...` o `https://youtu.be/...`) y confirma
- **THEN** EL SISTEMA extrae el identificador del video, lo aplica como fondo activo y lo almacena en la lista de fondos personalizados recientes.

#### Scenario: Ingreso de enlace de imagen o GIF
- **WHEN** el usuario introduce una URL directa de imagen o GIF y confirma
- **THEN** EL SISTEMA aplica inmediatamente la URL como fondo visual y la guarda en los recientes.

### Requirement: Persistencia integral en almacenamiento local
EL SISTEMA SHALL persistir en `localStorage` el identificador o configuración del fondo activo, el nivel porcentual del atenuador de oscurecimiento y la lista de fondos personalizados del usuario.

#### Scenario: Restauración de sesión previa
- **WHEN** el usuario vuelve a abrir o recarga la aplicación en el navegador
- **THEN** EL SISTEMA restaura automáticamente el último fondo seleccionado junto con el porcentaje de atenuación previamente configurado.
