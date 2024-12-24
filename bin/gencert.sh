#!/bin/sh
basepath=$(cd `dirname $0`;pwd);
workspace=$(cd `dirname $0`;cd ..;pwd);

certsDir=${workspace}/apps/tsai-admin/.conf/certs

if [ ! -d "$certsDir" ];then 
    mkdir -p $certsDir
else 
    rm -rf ${certsDir}/*
fi

conf=${basepath}/localhost-ssl.conf

cd $certsDir
openssl req -config $conf \
 -new -x509 -sha256 -newkey rsa:2048 \
 -nodes -keyout cert.key -days 3650 -out cert.pem

cd $basepath
