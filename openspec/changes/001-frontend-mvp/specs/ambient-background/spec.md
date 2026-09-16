## Purpose

Gestiona la ambientación visual inmersiva de la sala de estudio, proporcionando fondos en bucle de alta calidad y un selector categorizado que persiste la preferencia del usuario.

## ADDED Requirements

### Requirement: Capa de renderizado de fondos dinámicos
EL SISTEMA SHALL renderizar el fondo de pantalla en pantalla completa detrás de los widgets flotantes, soportando imágenes estáticas optimizadas (WebP), videos en bucle sin fin (`<video autoplay loop muted>`) y reproductor embebido de YouTube sin distracciones (`controls=0`).

#### Scenario: Cambio de fondo visual
- **WHEN** el usuario selecciona un nuevo fondo de la categoría "Anime" en el panel modal
- **THEN** la capa de fondo realiza una transición suave hacia el nuevo video o imagen sin recargar la página

### Requirement: Persistencia de fondo preferido
EL SISTEMA SHALL guardar el identificador del fondo activo en el almacenamiento local del navegador (`localStorage`) para restaurarlo automáticamente en visitas posteriores.

#### Scenario: Carga de fondo previo
- **WHEN** el usuario ingresa a la aplicación tras haber cerrado el navegador
- **THEN** la sala de estudio carga de inmediato el último fondo seleccionado
