# Use a Node.js image to build the React app
FROM node:20-alpine
WORKDIR /app
COPY . .

RUN npm init -y
RUN npm install

RUN npm run build


CMD ["npm", "run", "dev"]