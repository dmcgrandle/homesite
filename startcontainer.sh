#!/bin/sh
#
# Startup script to copy configs and start processes
#

# Anything appended to the stdout of PID 1 will appear in "docker logs" for the container
LOGLOC=/proc/1/fd/1

# Create the keys directory (doesn't exist in docker image)
mkdir /homesite/keys

# Copy in appropriate keys from config to overwrite defaults
if [ -d /homesite/config/keys ]
then
    cp -f /homesite/config/keys/* /homesite/keys
    echo "Found custom keys and copied them into the container." >> $LOGLOC
fi

# Set up /protected directories if they don't exist
if [ ! -d /homesite/protected/images ]
then
    echo "No directory /protected/images - creating with defaults." >> $LOGLOC
    mkdir /homesite/protected/images
    cp /homesite/public/assets/images/Mountain.jpg /homesite/protected/images
fi
if [ ! -d /homesite/protected/videos ]
then
    echo "No directory /protected/videos - creating with defaults." >> $LOGLOC
    mkdir /homesite/protected/videos
    cp /homesite/public/assets/video/Beach* /homesite/protected/videos
fi
if [ ! -d /homesite/protected/downloads ]
then
    echo "No directory /protected/downloads - creating with defaults." >> $LOGLOC
    mkdir /homesite/protected/downloads
    cp /homesite/public/assets/images/Mountain.jpg /homesite/protected/downloads
fi

# Copy over custom config files if they exist
if [ -d /homesite/config/public/assets/config ]
then
    cp /homesite/config/public/assets/config/* /homesite/public/assets/config
    echo "Custom client configs found and copied into the container." >> $LOGLOC
fi

# copy in custom public image and video files if they exist
if [ -d /homesite/config/public/assets/images ]
then
    cp /homesite/config/public/assets/images/* /homesite/public/assets/images
    echo "Custom public images found and copied into the container." >> $LOGLOC
fi
if [ -d /homesite/config/public/assets/video ]
then
    cp /homesite/config/public/assets/video/* /homesite/public/assets/video
    echo "Custom public videos found and copied into the container." >> $LOGLOC
fi

# Copy over custom server config file if it exists
if [ -f /homesite/config/server.config.js ]
then
    cp /homesite/config/server.config.js /homesite//assets/config
    echo "Custom client configs found and copied into the container." >> $LOGLOC
fi


supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
