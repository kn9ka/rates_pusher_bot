# Используем Node.js как базовый образ
FROM node:20-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Запускаем бота напрямую через tsx
CMD ["npm", "run", "dev"]