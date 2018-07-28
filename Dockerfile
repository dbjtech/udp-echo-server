FROM node:slim

RUN mkdir -p /src/app
WORKDIR /src/app

RUN apt update && apt install python make g++ -y && npm install fibers sqlite3 && npm cache clean && apt remove python make g++ -y && apt-get clean -y && apt-get autoremove -y

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

COPY ./bin/package.json package.json
RUN npm i --production && npm cache clean

COPY ./bin .
CMD node .

EXPOSE 80