# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

RUN npm install

# Copiar el resto del código
COPY . .

# Ejecutar el build de Vite
RUN npm run build

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine

# Copiar el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los assets compilados desde la etapa 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
