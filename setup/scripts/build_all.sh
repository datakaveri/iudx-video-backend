#!/bin/bash

PROJECT_ROOT="$PWD/../"

(cd ../setup/apps/ \
    && docker-compose build)

(cd ../setup/video-server-backend/ \
    && docker-compose build)