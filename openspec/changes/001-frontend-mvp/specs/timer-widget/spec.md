## Purpose

Gestiona la cuenta regresiva de los bloques Pomodoro con precisión matemática inmune al estrangulamiento de navegadores, permitiendo pausar, reanudar y persistir la sesión activa.

## ADDED Requirements

### Requirement: Máquina de estados del temporizador
EL SISTEMA SHALL transicionar entre los estados `IDLE`, `RUNNING`, `PAUSED` y `COMPLETED` en respuesta a las acciones del usuario y a la finalización del tiempo objetivo.

#### Scenario: Iniciar cuenta regresiva
- **WHEN** el usuario pulsa el botón "Play" en estado `IDLE` o `PAUSED`
- **THEN** el sistema pasa al estado `RUNNING`, establece el timestamp de finalización objetivo (`Date.now() + remainingSeconds * 1000`) y actualiza el contador cada segundo

#### Scenario: Pausar cuenta regresiva
- **WHEN** el usuario pulsa el botón "Pausa" en estado `RUNNING`
- **THEN** el sistema pasa al estado `PAUSED`, congela el tiempo restante exacto y detiene los ticks activos

### Requirement: Cálculo drift-free sin desfase por pestaña inactiva
SI la pestaña del navegador pasa a segundo plano o se minimiza, ENTONCES EL SISTEMA SHALL calcular el tiempo restante exacto comparando el timestamp objetivo contra la hora actual (`targetTimestamp - Date.now()`), evitando el retraso acumulado por el estrangulamiento de `setInterval`.

#### Scenario: Retorno de pestaña minimizada
- **WHEN** el usuario regresa a la pestaña tras 5 minutos en otra aplicación
- **THEN** el temporizador muestra el tiempo real descontado sin un solo segundo de retraso acumulado

### Requirement: Finalización y guardado automático de sesión de trabajo
CUANDO el temporizador en modo `WORK` llega a cero (estado `COMPLETED`), EL SISTEMA SHALL reproducir una señal sonora sutil, cambiar automáticamente al modo de descanso configurado y enviar una petición `POST /api/sessions` al backend para persistir la sesión en UTC.

#### Scenario: Bloque de estudio completado
- **WHEN** el temporizador de 25 minutos llega a 00:00:00
- **THEN** el sistema emite el sonido de campanada, registra la sesión en la API y deja listo el descanso de 5 minutos
