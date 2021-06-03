#/bin/bash

docker network create vs-net

(cd ../setup/video-server-backend/ \
    && docker-compose up -d)
