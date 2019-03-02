#!/bin/sh
#
# Startup script to copy configs and start processes
#

# Create the keys directory (doesn't exist in docker image)
mkdir /homesite/keys

# Copy in appropriate keys
if [ -d /homesite/config/keys ]
then
    cp /homesite/config/keys/* /homesite/keys
else
    cp /homesite/default-keys/* /homesite/keys
fi

# Set up /protected directories if they don't exist
if [ ! -d /homesite/protected ]
then
    mkdir /homesite/protected
    mkdir /homesite/protected/images
    mkdir /homesite/protected/videos
    mkdir /homesite/protected/downloads
    cp /homesite/public/assets/images/Mountain.jpg /homesite/protected/images
    cp /homesite/public/assets/images/Mountain.jpg /homesite/protected/downloads
    cp /homesite/public/assets/video/Beach* /homesite/protected/videos
fi

supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
