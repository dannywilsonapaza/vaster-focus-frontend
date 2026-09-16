## Purpose

Controla la mezcla simultánea de pistas de audio ambiental mediante la Web Audio API nativa, permitiendo regular volúmenes independientes y silenciar el entorno sin interrupciones.

## ADDED Requirements

### Requirement: Reproducción multicanal independiente
EL SISTEMA SHALL permitir reproducir y mezclar simultáneamente múltiples fuentes de sonido ambiental (Lofi beats, Lluvia, Fuego de chimenea, Biblioteca) en bucle continuo sin pausas perceptibles.

#### Scenario: Activación simultánea de lluvia y lofi
- **WHEN** el usuario activa la pista de lluvia y la pista de lofi
- **THEN** ambas pistas suenan en paralelo de manera sincronizada sin bloquear la interfaz de usuario

### Requirement: Control de volumen por canal y mute maestro
EL SISTEMA SHALL proporcionar deslizadores de ganancia individuales (0 a 100%) para cada canal de audio y un botón de silencio (*mute*) maestro que suspenda toda salida acústica sin perder la configuración de los canales individuales.

#### Scenario: Ajuste de volumen individual
- **WHEN** el usuario desliza el control de volumen de lluvia al 40%
- **THEN** el nodo de ganancia (`GainNode`) de lluvia ajusta su amplitud inmediatamente sin alterar el volumen de las demás pistas

#### Scenario: Mute maestro
- **WHEN** el usuario pulsa el botón maestro de silenciar
- **THEN** el nodo maestro de ganancia se reduce a 0, conservando la posición de los deslizadores visuales para restaurarlos al desmutear
