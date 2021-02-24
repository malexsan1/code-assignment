FROM node:alpine

WORKDIR /next-js-app

COPY ./package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build
EXPOSE 3000

CMD [ "npm", "start" ]
