# ==============================================================================
# ETAPA 1: Construcción (Builder) - Node.js 22 Alpine + pnpm
# ==============================================================================
FROM node:22-alpine AS builder

# 1. Habilitar pnpm mediante Corepack nativo de Node.js
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 2. Copiar manifiestos primero para aprovechar el caché de capas de Docker
COPY package.json pnpm-lock.yaml ./

# 3. Instalar dependencias exactas sin scripts bloqueados por pnpm v12
RUN pnpm install --frozen-lockfile --ignore-scripts

# 4. Copiar todo el código fuente del frontend
COPY . .

# 5. Compilar para producción (reemplaza environment.ts por environment.prod.ts)
RUN pnpm build

# ==============================================================================
# ETAPA 2: Ejecución (Runtime) - Nginx Alpine ultraligero (~25 MB)
# ==============================================================================
FROM nginx:alpine

# 1. Copiar los archivos estáticos compilados desde la etapa builder
COPY --from=builder /app/dist/vaster-focus-frontend/browser /usr/share/nginx/html

# 2. Copiar la configuración personalizada de Nginx con soporte para SPA y gzip
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Exponer el puerto HTTP estándar
EXPOSE 80

# 4. Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
