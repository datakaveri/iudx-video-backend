#/bin/bash

docker network rm vs-net

(cd ../setup/postgres/ \
    && docker-compose --env-file ../../../.env down)


