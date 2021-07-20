#/bin/bash

PROJECT_ROOT="$PWD/../../"

export PROJECT_ROOT=$PROJECT_ROOT
export SCHEMA_FILE="$PROJECT_ROOT/setup/apps/video/postgres/lms-schema.sql"

docker network create vs-net


docker-compose \
    -f $PROJECT_ROOT/setup/setup/nginx-rtmp/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/postgres/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/monitoring/docker-compose.yml \
    --env-file $PROJECT_ROOT/.env \
    -p iudx_vs \
    up -d nginxrtmp postgres pgadmin loki promtail pushgateway prometheus grafana