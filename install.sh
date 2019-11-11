#!/bin/sh


BASEDIR=$(dirname $(readlink -f "$0"))
echo 'Installig service...'
sed -e "s#<path>#${BASEDIR}/fcontroll.js#g;\
        s#<dir>#${BASEDIR}#g" fcontrol.service > /etc/systemd/system/fcontrol.service
