FROM node:slim

ENV NODE_PORT 8080
ENV NODE_HOST 0.0.0.0
ENV NO_UPDATE_NOTIFIER true

# Create app directory
WORKDIR /usr/src/app/server

# Entrypoint allows adding in ENV variables to the run command.
COPY ./api/package*.json ./
COPY ./api/entrypoint.sh .

RUN chmod +x /usr/src/app/server/entrypoint.sh

# Very basic server for serving up static assets.
RUN npm install --no-color --production --quiet

COPY ./api ./

RUN groupadd -r express && useradd -r -g express express

USER express

EXPOSE 8080
CMD [ "/usr/src/app/server/entrypoint.sh" ]
