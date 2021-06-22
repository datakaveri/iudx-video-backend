#!/bin/bash

(cd ../setup/apps/ \
    && docker-compose build)

(cd ../setup/nginx-rtmp/ \
    && docker-compose build)

(cd ../setup/video-server/ \
    && docker-compose build)