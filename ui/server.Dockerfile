FROM node:slim as ui

ENV NODE_ENV production
ENV NO_UPDATE_NOTIFIER true

WORKDIR /usr/src/app/
COPY ./my-app/package*.json ./
RUN npm install --no-color --production --quiet

COPY ./my-app/. ./

RUN npm run build

FROM node:slim

ENV NODE_ENV production
ENV NODE_PORT 8080
ENV NODE_HOST 0.0.0.0
ENV NO_UPDATE_NOTIFIER true
ENV STATIC_ASSETS ./build

# Create app directory
WORKDIR /usr/src/app/server

# Entrypoint allows adding in ENV variables to the run command.
COPY ./server/package*.json ./
COPY ./server/entrypoint.sh .
COPY ./server/index.js .

RUN chmod +x /usr/src/app/server/entrypoint.sh

# Very basic server for serving up static assets.
RUN npm install --no-color --production --quiet

# Bundle the static content
COPY --from=ui /usr/src/app/build /usr/src/app/build

RUN groupadd -r express && useradd -r -g express express

USER express

EXPOSE 8080
CMD [ "/usr/src/app/server/entrypoint.sh" ]
