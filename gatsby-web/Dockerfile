FROM node:18

WORKDIR /usr/src/app

RUN npm install --global gatsby-cli

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
CMD ["yarn", "serve", "-p", "8080", "-H", "0.0.0.0"]

USER node