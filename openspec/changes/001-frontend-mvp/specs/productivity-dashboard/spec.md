## Purpose

Visualiza las métricas agregadas de rendimiento del usuario, mostrando el tiempo de estudio diario proyectado en hora de Lima, la racha activa y gráficos comparativos de consistencia.

## ADDED Requirements

### Requirement: Tarjetas de métricas principales
EL SISTEMA SHALL mostrar tarjetas de resumen con el tiempo total enfocado hoy (formato HH:mm), la racha activa de días consecutivos (`currentStreak`), la mejor racha histórica (`bestStreak`) y el promedio diario de estudio.

#### Scenario: Carga de métricas desde la API
- **WHEN** el usuario navega a la vista de Dashboard (`/dashboard`)
- **THEN** el sistema invoca `GET /api/stats/summary` y renderiza las tarjetas con los datos en tiempo real

### Requirement: Gráfico de horas estudiadas por día
EL SISTEMA SHALL renderizar un gráfico de barras interactivo con el tiempo de estudio acumulado por cada día calendario local en Lima, mostrando las fechas en formato DD/MM y las horas en el eje vertical.

#### Scenario: Visualización de historial de 30 días
- **WHEN** se reciben los datos de `GET /api/stats/daily`
- **THEN** el gráfico dibuja las barras proporcionales a las horas de concentración efectivas de cada fecha
