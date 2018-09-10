#!/bin/sh
#
# Startup script to copy configs and start processes
#

supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
