FROM node:6.14-stretch

RUN mkdir /app
WORKDIR /app
ADD . /app

RUN yarn global add serverless create-react-app
RUN cd api && yarn install
RUN cd web && yarn install