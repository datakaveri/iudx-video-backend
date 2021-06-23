#/bin/bash

PROJECT_ROOT="$PWD/../../"

export PROJECT_ROOT=$PROJECT_ROOT
export TOPICS_FILE="$PROJECT_ROOT/setup/apps/video/kafka/topics.json"
export SCHEMA_FILE="$PROJECT_ROOT/setup/apps/video/postgres/schema.sql"

docker network create vs-net


docker-compose \
    -f $PROJECT_ROOT/setup/setup/zookeeper/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/kafka/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/apps/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/nginx-rtmp/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/postgres/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/video-server/docker-compose.yml \
    --env-file $PROJECT_ROOT/.env \
    -p iudx_vs \
    up -d zook kafka kafkainit nginxrtmp postgres pgadmin videoserver