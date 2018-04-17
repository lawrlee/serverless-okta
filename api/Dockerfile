FROM node:6.14-stretch

RUN mkdir /api
WORKDIR /api
ADD . /api

RUN yarn global add serverless
RUN yarn

CMD serverless offline --host 0.0.0.0 --port 5000 start