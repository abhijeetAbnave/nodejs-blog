FROM node:14.17.3-buster as build

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --production

COPY . .

CMD [ "npm", "run", "dev" ]