FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
CMD ["node", "dist/index.js"]

USER node
