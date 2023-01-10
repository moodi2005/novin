FROM node:19-alpine3.16

ENV VERSION 0.0.0

ADD . .

RUN yarn
RUN yarn build

EXPOSE 80

CMD ["yarn","start"]