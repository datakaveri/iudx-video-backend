#/bin/bash

PROJECT_ROOT="$PWD/../../"

export PROJECT_ROOT=$PROJECT_ROOT
# added seperate variables for lms_schema and cms_schema
export SCHEMA_FILE_LMS="$PROJECT_ROOT/setup/apps/video/postgres/lms-schema.sql"
export SCHEMA_FILE_CMS="$PROJECT_ROOT/setup/apps/video/postgres/cms-schema.sql"

docker network create vs-net


docker-compose \
    -f $PROJECT_ROOT/setup/setup/nginx-rtmp/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/postgres/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/video-server/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/monitoring/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/nginx/docker-compose-lms.yml \
    --env-file $PROJECT_ROOT/.env \
    -p iudx_vs \
    up -d nginxrtmp lms_postgres pgadmin lms_videoserver promtail vsnginx