FROM node:6.14-stretch

RUN mkdir /web
WORKDIR /web
ADD . /web

RUN yarn global add create-react-app
RUN yarn

CMD yarn start