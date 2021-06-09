#/bin/bash

PROJECT_ROOT="$PWD/../../"

export SCHEMA_FILE="$PROJECT_ROOT/setup/apps/video/postgres/schema.sql"

(cd ../setup/postgres/ \
    && docker-compose --env-file $PROJECT_ROOT/.env up -d)




