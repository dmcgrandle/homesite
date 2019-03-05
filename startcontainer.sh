#!/bin/sh
#
# Startup script to copy configs and start processes
#

# Create the keys directory (doesn't exist in docker image)
mkdir /homesite/keys

# Copy in appropriate keys from config to overwrite defaults
if [ -d /homesite/config/keys ]
then
    cp -f /homesite/config/keys/* /homesite/keys
fi

# Set up /protected directories if they don't exist
if [ ! -d /homesite/protected/images ]
then
    echo "No directory /protected/images - creating with defaults."
    mkdir /homesite/protected/images
    cp /homesite/public/assets/images/Mountain.jpg /homesite/protected/images
fi
if [ ! -d /homesite/protected/videos ]
then
    echo "No directory /protected/videos - creating with defaults."
    mkdir /homesite/protected/videos
    cp /homesite/public/assets/video/Beach* /homesite/protected/videos
fi
if [ ! -d /homesite/protected/downloads ]
then
    echo "No directory /protected/downloads - creating with defaults."
    mkdir /homesite/protected/downloads
    cp /homesite/public/assets/images/Mountain.jpg /homesite/protected/downloads
fi

# Copy over custom config files if they exist
if [ -d /homesite/config/public/assets/config ]
then
    cp /homesite/config/public/assets/config/* /homesite/public/assets/config
fi

# copy in custom public image and video files if they exist
if [ -d /homesite/config/public/assets/images ]
then
    cp /homesite/config/public/assets/images/* /homesite/public/assets/images
fi
if [ -d /homesite/config/public/assets/video ]
then
    cp /homesite/config/public/assets/video/* /homesite/public/assets/video
fi


supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
