FROM node:14-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache ffmpeg
COPY ./package*.json .
RUN npm i 
COPY . .
RUN npm run build
# FROM ubuntu:20.04
# RUN apt-get update
# RUN apt-get -y install curl
# RUN apt -y install ffmpeg
# RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
# RUN apt-get -y install nodejs
# WORKDIR /usr/src/app
# COPY ./package*.json .
# RUN npm i
# COPY . .
# RUN npm run build