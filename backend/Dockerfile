FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules && npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]