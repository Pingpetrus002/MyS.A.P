FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install && npm i

COPY . /vite

EXPOSE 90

CMD [ "npm", "run", "dev" ]