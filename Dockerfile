FROM node:6.14-stretch

RUN mkdir /app
WORKDIR /app
ADD . /app

RUN yarn global add serverless
RUN yarn install