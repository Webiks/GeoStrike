FROM node:alpine

RUN apk add --update yarn
RUN yarn global add serve

COPY ./dist /opt/app

WORKDIR /opt/app

EXPOSE 5000

ENTRYPOINT serve -s
