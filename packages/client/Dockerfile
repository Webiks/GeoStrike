FROM node:alpine

RUN apk add --update yarn

COPY . /opt/app

WORKDIR /opt/app

RUN yarn

EXPOSE 4200

ENTRYPOINT yarn start:docker
