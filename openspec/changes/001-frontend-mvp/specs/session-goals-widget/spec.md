## Purpose

Permite gestionar una lista interactiva de objetivos de concentración durante la sesión de estudio, mostrando contadores de progreso y sincronizándose con la API de backend.

## ADDED Requirements

### Requirement: Gestión de metas de estudio
EL SISTEMA SHALL permitir al usuario ingresar nuevas metas mediante un campo de texto con botón de adición o tecla Enter, listarlas con casillas de verificación y eliminarlas cuando sea necesario.

#### Scenario: Creación de meta
- **WHEN** el usuario escribe "Repasar algoritmos de ordenamiento" y pulsa Enter
- **THEN** el sistema añade la meta en estado pendiente, actualiza el contador de metas abiertas e invoca `POST /api/goals`

#### Scenario: Completar meta
- **WHEN** el usuario hace clic en el círculo de verificación de una meta pendiente
- **THEN** la meta se marca con estilo tachado visual, el contador de metas completadas se incrementa y se invoca `PATCH /api/goals/:id`

### Requirement: Contadores de progreso en tiempo real
EL SISTEMA SHALL mostrar dos indicadores visuales destacados: total de metas abiertas (*Open*) y total de metas completadas (*Completed*) para la sesión actual.

#### Scenario: Actualización de contadores
- **WHEN** el usuario completa una de las 3 metas activas
- **THEN** el panel actualiza los contadores a "2 Open, 1 Completed" de forma inmediata
