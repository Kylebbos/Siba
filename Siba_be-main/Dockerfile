FROM node:20

ENV BE_SERVER_PORT=4678
WORKDIR /app
COPY package.json .

RUN npm install
COPY . .
EXPOSE ${BE_SERVER_PORT}
CMD ["npm", "start"]
