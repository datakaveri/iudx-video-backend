#!/bin/bash

PROJECT_ROOT="$PWD/../../"

export PROJECT_ROOT=$PROJECT_ROOT
export TOPICS_FILE="$PROJECT_ROOT/setup/apps/video/kafka/topics.json"
export SCHEMA_FILE="$PROJECT_ROOT/setup/apps/video/postgres/schema.sql"

echo "[1] Development  [2] Production"
read environment

if [[ $environment -eq 1 ]]
then
    cp $PROJECT_ROOT/setup/apps/video/nginx-rtmp/dev.nginx.conf \
       $PROJECT_ROOT/setup/setup/nginx-rtmp/nginx.conf
elif [[ $environment -eq 2 ]]
then
    echo "Choose type of Nginx RTMP configuration:"
    echo "[1] SSL  [2] SSL + on-demand"
    read nginxconf
    if [[ $nginxconf -eq 1 ]]
    then
        cp $PROJECT_ROOT/setup/apps/video/nginx-rtmp/prod.nginx.conf \
        $PROJECT_ROOT/setup/setup/nginx-rtmp/nginx.conf
    elif [[ $nginxconf -eq 2 ]]
    then
        cp $PROJECT_ROOT/setup/apps/video/nginx-rtmp/prod.nginx.ondemand.conf \
        $PROJECT_ROOT/setup/setup/nginx-rtmp/nginx.conf
    fi
fi

docker-compose \
    -f $PROJECT_ROOT/setup/setup/zookeeper/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/kafka/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/apps/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/nginx-rtmp/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/postgres/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/video-server/docker-compose.yml \
    --env-file $PROJECT_ROOT/.env \
    build zook kafka kafkainit nginxrtmp postgres videoserver
