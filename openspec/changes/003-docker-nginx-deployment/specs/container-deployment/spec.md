## Purpose

Define los requerimientos del empaquetado en contenedor Docker y la entrega de activos estáticos mediante el servidor web Nginx para el frontend de Vaster Focus.

## ADDED Requirements

### Requirement: Empaquetado Multi-Stage en contenedor
EL SISTEMA SHALL compilar el proyecto Angular en una etapa de construcción con Node.js y copiar exclusivamente el resultado estático compilado en una etapa de ejecución basada en Nginx Alpine.

#### Scenario: Construcción de imagen de producción
- **CUANDO** se ejecuta el comando `docker build` en el repositorio frontend
- **ENTONCES** la imagen generada contiene solo el servidor Nginx y los archivos estáticos de `dist/`, sin incluir `node_modules` ni herramientas de desarrollo

### Requirement: Enrutamiento SPA y entrega estática
EL SISTEMA SHALL entregar las rutas de la aplicación Angular redirigiendo cualquier URI no coincidente con un archivo físico hacia `/index.html` con código HTTP 200.

#### Scenario: Acceso directo a una ruta interna
- **CUANDO** un usuario accede directamente a `http://localhost/dashboard` o recarga la página
- **ENTONCES** Nginx entrega `index.html` permitiendo que el enrutador de Angular gestione la vista en el navegador

### Requirement: Optimización de transferencia y compresión
EL SISTEMA SHALL habilitar compresión gzip para archivos de texto (HTML, JS, CSS, JSON, SVG) servidos por Nginx.

#### Scenario: Petición de activos JavaScript y CSS
- **MIENTRAS** el cliente admita cabecera `Accept-Encoding: gzip`
- **EL SISTEMA SHALL** transferir los assets comprimidos reduciendo el ancho de banda consumido
