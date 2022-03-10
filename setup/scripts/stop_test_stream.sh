#!/bin/bash

PROJECT_ROOT="$PWD/../../"
UI_PROJECT_ROOT="$PWD/../../../"
export PROJECT_ROOT=$PROJECT_ROOT

docker-compose -f $PROJECT_ROOT/setup/testimage/docker-compose.yml down