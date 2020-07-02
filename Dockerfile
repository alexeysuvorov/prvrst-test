FROM node:10.8-alpine

ENV NODE_ENV=prod

ENV NODE_DIR /home/nodejs/app
WORKDIR $NODE_DIR

RUN yarn

COPY package.json yarn.lock $NODE_DIR/
RUN yarn install --production

COPY . $NODE_DIR
RUN yarn build-prod

COPY config $NODE_DIR/build/config
COPY schemas $NODE_DIR/build/schemas
COPY migrations $NODE_DIR/build/migrations

CMD ["yarn", "deploy"]

EXPOSE 8080
