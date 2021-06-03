#/bin/bash

PROJECT_ROOT="$PWD/../"

export SCHEMA_FILE="$PROJECT_ROOT/apps/video/postgres/schema.sql"

(cd ../setup/postgres/ \
    && docker-compose --env-file ../../../.env up -d)




