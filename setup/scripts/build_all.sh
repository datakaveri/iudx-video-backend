#!/bin/bash

PROJECT_ROOT="$PWD/../../"
UI_PROJECT_ROOT="$PWD/../../../"

export PROJECT_ROOT=$PROJECT_ROOT
export TOPICS_FILE="$PROJECT_ROOT/setup/apps/video/kafka/topics.json"
export SCHEMA_FILE="$PROJECT_ROOT/setup/apps/video/postgres/schema.sql"
export UI_PROJECT_PATH="$UI_PROJECT_ROOT/iudx-video-frontend"

NGINX_DOCKER="$PROJECT_ROOT"

echo "Choose the build environment:"
echo -e "\033[1;30m[1] Development  [2] Production \033[0m"
read environment

if [[ $environment -eq 1 ]]
then
    cp $PROJECT_ROOT/setup/apps/video/nginx-rtmp/dev.nginx.conf \
       $PROJECT_ROOT/setup/setup/nginx-rtmp/nginx.conf
    NGINX_DOCKER="$PROJECT_ROOT/setup/setup/nginx/docker-compose-lms.yml"
elif [[ $environment -eq 2 ]]
then
    echo "Choose type of Nginx RTMP configuration:"
    echo -e "\033[1;30m[1] CMS  [2] LMS \033[0m"
    read nginxconf
    if [[ $nginxconf -eq 1 ]]
    then
        cp $PROJECT_ROOT/setup/apps/video/nginx-rtmp/cmsprod.nginx.conf \
        $PROJECT_ROOT/setup/setup/nginx-rtmp/nginx.conf
        NGINX_DOCKER="$PROJECT_ROOT/setup/setup/nginx/docker-compose-cms.yml"
    elif [[ $nginxconf -eq 2 ]]
    then
        cp $PROJECT_ROOT/setup/apps/video/nginx-rtmp/lmsprod.nginx.conf \
        $PROJECT_ROOT/setup/setup/nginx-rtmp/nginx.conf
        NGINX_DOCKER="$PROJECT_ROOT/setup/setup/nginx/docker-compose-lms.yml"
    fi
fi

docker-compose \
    -f $PROJECT_ROOT/setup/setup/zookeeper/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/kafka/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/apps/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/nginx-rtmp/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/postgres/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/video-server/docker-compose.yml \
    -f $NGINX_DOCKER \
    --env-file $PROJECT_ROOT/.env \
    build zook kafka kafkainit nginxrtmp postgres videoserver vsnginx
