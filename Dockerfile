# Dockerfile for homesite
# v0.1 09-05-2018
# update 03-01-2019
#
# usage is as follows:
# docker build -t homesite:0.1 .
# then:
# docker run --name=homesite -v <path to homesite/server/protected>:/homesite/protected -p3000:3000 -d homesite:0.1

# We first need a temporary container for building and installing all node modules
FROM node:10-alpine
WORKDIR /homesite
RUN apk update

# The following is no longer needed since sharp now has pre-compiled binaries:
# RUN apk add vips-dev fftw-dev build-base gcc make python2 --update-cache \
#  --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ \
#  --repository http://dl-3.alpinelinux.org/alpine/edge/main

# We do still need a 2-stage process since bcrypt requires building from source in alpine.
RUN apk add build-base  python2 --update-cache
COPY ./server/package.json /homesite
RUN npm install --only=production

# Finally Docker now allows us to multi-stage the build, saving about 60MB of space in this case
FROM node:10-alpine
ENV NODE_ENV production
LABEL maintainer "Darren McGrandle <darren@mcgrandle.com>"
WORKDIR /homesite
RUN mkdir -p /homesite/logs /homesite/protected /homesite/db
COPY ./supervisord.conf/* /etc/supervisor/conf.d/

# Need to install necessary packages
RUN apk update && apk add mongodb mongodb-tools supervisor ffmpeg 
COPY ./server/package.json /homesite

# Copy the node modules and /usr/lib from the first temp alpine container
COPY --from=0 /homesite/node_modules /homesite/node_modules
RUN npm update
COPY --from=0 /usr/lib/lib* /usr/lib/

# Copy the shell script to start the container as well as app data (client and server)
COPY ./startcontainer.sh ./server/app.js ./server/config.js ./server/default-users.json ./server/file-type-description.txt /homesite/
COPY ./server/bin /homesite/bin
COPY ./server/keys /homesite/keys
COPY ./server/public /homesite/public
COPY ./server/routes /homesite/routes
COPY ./server/services /homesite/services

EXPOSE 3000
CMD ["/homesite/startcontainer.sh"]
