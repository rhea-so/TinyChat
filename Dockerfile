FROM node:latest
MAINTAINER JeongHyeon Kim <gameboy5141@gmail.com>
RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 8080
CMD ["node", "dist", "--env=local"]