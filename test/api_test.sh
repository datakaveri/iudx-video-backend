#!/bin/bash

docker build -t stream-server ../setup/testimage

email='test@datakaveri.org'
password='test'

# SignUp Data
getUserData() {
    cat <<EOF
{
    "name": "Test User",
    "email": "$email",
    "password": "$password",
    "role": "user"
}
EOF
}

# Token Data
getTokenData() {
    cat <<EOF
{
    "email": "$email",
    "password": "$password"
}
EOF
}

# Camera Data
getCameraData() {
    cat <<EOF
[
    {
        "cameraNum": 15,
        "cameraName" : "camera_5",
        "cameraType" : "DOME",
        "cameraUsage" : "RLVD",
        "cameraOrientation" : "NORTH-EAST",
        "city" : "Bangalore",
        "location" : "lat/long"
    }
]
EOF
}

# Stream Data
getStreamData() {
    cat <<EOF
[
    {
        "cameraId" : "$camera_id",
        "streamName" : "test_stream_1" ,
        "streamUrl" : "rtsp://localhost:8554/stream1",
        "streamType" : "RTMP",
        "type": "camera",
        "isPublic" : false
    }
]
EOF
}

# Register the user
printf "Registering test user\n"
curl -sS --location --request POST 'http://localhost:4000/api/auth/signup' --header 'Content-Type: application/json' --data-raw "$(getUserData)"

sleep 2
printf "\n\nRegistered test user\n"

# Verify the user
printf "\nVerifying test user\n"
code=$(psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'SELECT "verificationCode" FROM public."Users" WHERE email=$$test@datakaveri.org$$')

updated_code=$(echo "${code}" | xargs)

curl -sS --location --request GET "http://localhost:4000/api/auth/verify?verificationCode=${updated_code}"
sleep 2
printf "\n\nVerified test user\n"

# Get Token
printf "\nGenerating Token\n"
token=$(
    curl -sS --location --request POST 'http://localhost:4000/api/auth/token' \
        --header 'Content-Type: application/json' --data-raw "$(getTokenData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['token'])"
)

sleep 1
printf "\n\nGenerated Token\n"

# Register Camera
printf "\nRegistering a camera\n"
camera_id=$(
    curl -sS --location --request POST 'http://localhost:4000/api/cameras' \
        --header "Authorization: Bearer ${token}" \
        --header 'Content-Type: application/json' \
        --data-raw "$(getCameraData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['cameraId'])"
)

sleep 1
printf "\n\nRegistered test camera\n"

printf "\nCreating test streaming server\n"
docker run --name stream-test -d -p 8554:8554 stream-server

sleep 5
printf "\nCreated test streaming server\n"

# Registering a stream
printf "\nRegistering a stream\n"
stream_id=$(
    curl -sS --location --request POST 'http://localhost:4000/api/streams' \
        --header "Authorization: Bearer ${token}" \
        --header 'Content-Type: application/json' \
        --data-raw "$(getStreamData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['streamId'])"
)
sleep 10
printf "\n\nRegistered the stream\n"

# Check stream status
printf "\nChecking status of the stream\n"
stream_status=$(
    curl -sS --location --request GET "http://localhost:4000/api/streams/status/${stream_id}" \
        --header "Authorization: Bearer ${token}" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['isActive'])"
)
sleep 1

# cleanup

# Delete stream
curl -sS --location --request DELETE "http://localhost:4000/api/streams/${stream_id}" \
    --header "Authorization: Bearer ${token}"
sleep 1

# Delete Camera
curl -sS --location --request DELETE "http://localhost:4000/api/cameras/${camera_id}" \
    --header "Authorization: Bearer ${token}"
sleep 1

# Delete the user
psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'DELETE FROM public."Users" WHERE "email"=$$test@datakaveri.org$$'

docker container stop stream-test
docker rm stream-test

# Show test result

if [ "$stream_status" == "True" ]; then
    printf "\n\n\n\u2714 \033[0;Stream creation flow passed\033[0m \n"
else
    printf "\n\n\n\u274c \033[0;31mStream creation failed\033[0m \n"
fi
