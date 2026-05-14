FROM node:20-alpine

WORKDIR /app

# install deps first for better layer caching
COPY package*.json ./
RUN npm install --omit=dev

# copy source
COPY . .

# railway injects PORT automatically; we just expose for clarity
EXPOSE 5000

CMD ["node", "index.js"]
