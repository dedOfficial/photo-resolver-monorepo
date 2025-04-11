FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN mkdir -p dist/proto && cp -R src/proto/* dist/proto/
EXPOSE 3001
CMD ["node", "dist/main.js"]