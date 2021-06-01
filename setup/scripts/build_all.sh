#!/bin/bash

PROJECT_ROOT="$PWD/../"

(cd ../setup/apps/ \
    && docker-compose build)

