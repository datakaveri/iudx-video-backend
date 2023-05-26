#/bin/bash

PROJECT_ROOT="$PWD/../../"
UI_PROJECT_ROOT="$PWD/../../../"

export PROJECT_ROOT=$PROJECT_ROOT
export TOPICS_FILE="$PROJECT_ROOT/setup/apps/video/kafka/topics.json"
# added seperate variables for lms_schema and cms_schema
export SCHEMA_FILE_CMS="$PROJECT_ROOT/setup/apps/video/postgres/cms-schema.sql"
export SCHEMA_FILE_LMS="$PROJECT_ROOT/setup/apps/video/postgres/lms-schema.sql"

export UI_PROJECT_PATH="$UI_PROJECT_ROOT/iudx-video-frontend"

docker network create vs-net


docker-compose \
    -f $PROJECT_ROOT/setup/setup/zookeeper/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/kafka/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/apps/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/nginx-rtmp/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/postgres/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/monitoring/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/video-server/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/nginx/docker-compose-cms.yml \
    --env-file $PROJECT_ROOT/.env \
    -p iudx_vs \
    up -d zook kafka kafkainit nginxrtmp cms_postgres pgadmin loki promtail pushgateway prometheus grafana vsnginx