# Dockerfile for homesite
# v0.1 09-05-2018
#
# usage is as follows:
# docker build -t homesite:0.1 .

# We first need a temporary container to build vips-dev (needed by sharp) and install all node modules
FROM node:10-alpine
WORKDIR /homesite
RUN apk update && apk add build-base
RUN apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/
COPY ./server/package.json /homesite
RUN npm install --only=production

# Finally Docker now allows us to multi-stage the build, saving about 60MB of space in this case
FROM node:10-alpine
LABEL maintainer "Darren McGrandle <darren@mcgrandle.com>"
WORKDIR /homesite
RUN mkdir -p /homesite/logs /homesite/protected /homesite/db
COPY ./supervisord.conf/* /etc/supervisor/conf.d/

# Need to install necessary packages
RUN apk update && apk add mongodb supervisor ffmpeg 
COPY ./server/package.json /homesite

# Copy the node modules and /usr/lib from the first temp alpine container
COPY --from=0 /homesite/node_modules /homesite/node_modules
COPY --from=0 /usr/lib/lib* /usr/lib/

# Copy the shell script to start the container as well as app data (client and server)
COPY ./startcontainer.sh ./server/app.js ./server/config.js ./server/default-users.json ./server/file-type-description.txt /homesite/
COPY ./server/bin /homesite/bin
COPY ./config/keys /homesite/keys
COPY ./server/public /homesite/public
COPY ./server/routes /homesite/routes
COPY ./server/services /homesite/services

CMD ["/homesite/startcontainer.sh"]
