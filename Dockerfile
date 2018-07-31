FROM node:slim

RUN mkdir -p /src/app
WORKDIR /src/app

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

COPY ./bin/package.json package.json
RUN npm i --production && npm cache clean --force

COPY ./bin .
CMD node .

EXPOSE 6689
