FROM node

ENV NODE_PORT 8080
ENV NODE_HOST 0.0.0.0

# Create app directory
WORKDIR /usr/src/app/server

# Entrypoint allows adding in ENV variables to the run command.
COPY ./api/package*.json /usr/src/app/server/
COPY ./api/entrypoint.sh .
COPY ./api/server.js .

RUN chmod +x /usr/src/app/server/entrypoint.sh

# Very basic server for serving up static assets.
RUN npm install --no-color --production --quiet

RUN groupadd -r express && useradd -r -g express express

USER express

EXPOSE 8080
CMD [ "/usr/src/app/server/entrypoint.sh" ]
