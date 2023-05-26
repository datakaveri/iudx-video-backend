#/bin/bash

PROJECT_ROOT="$PWD/../../"

export PROJECT_ROOT=$PROJECT_ROOT
export SCHEMA_FILE_LMS="$PROJECT_ROOT/setup/apps/video/postgres/lms-schema.sql"
export SCHEMA_FILE_CMS="$PROJECT_ROOT/setup/apps/video/postgres/cms-schema.sql"


docker-compose \
    -f $PROJECT_ROOT/setup/setup/nginx-rtmp/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/postgres/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/video-server/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/monitoring/docker-compose.yml \
    -f $PROJECT_ROOT/setup/setup/nginx/docker-compose-lms.yml \
    --env-file $PROJECT_ROOT/.env \
    -p iudx_vs \
    down 

#docker network rm vs-net