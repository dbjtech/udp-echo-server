FROM node:slim

RUN mkdir -p /src/app
WORKDIR /src/app

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

RUN npm i --production && npm cache clean --force

CMD node .

EXPOSE 6689
