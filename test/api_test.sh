#!/bin/bash

docker build -t stream-server ../setup/testimage/Dockerfile

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
curl --location --request POST 'http://localhost:4000/api/auth/signup' --header 'Content-Type: application/json' --data-raw '$(getUserData)'

sleep 2

# Verify the user
code=$(psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'SELECT "verificationCode" FROM public."Users" WHERE email=$$test@datakaveri.org$$')

updated_code=$(echo "${code}" | xargs)

echo "http://localhost:4000/api/auth/verify?verificationCode=${updated_code}"

curl --location --request GET "http://localhost:4000/api/auth/verify?verificationCode=${updated_code}"
sleep 2

# Get Token
token=$(
    curl --location --request POST 'http://localhost:4000/api/auth/token' \
        --header 'Content-Type: application/json' --data-raw "$(getTokenData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['token'])"
)

sleep 1

# Register Camera
camera_id=$(
    curl --location --request POST 'http://localhost:4000/api/cameras' \
        --header "Authorization: Bearer ${token}" \
        --header 'Content-Type: application/json' \
        --data-raw "$(getCameraData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['cameraId'])"
)

sleep 1

docker run --name stream-test -d -p 8554:8554 stream-server

sleep 5

stream_id=$(
    curl --location --request POST 'http://localhost:4000/api/streams' \
        --header "Authorization: Bearer ${token}" \
        --header 'Content-Type: application/json' \
        --data-raw "$(getStreamData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['streamId'])"
)
sleep 5

# Check stream status
stream_status=$(
    curl --location --request GET "http://localhost:4000/api/streams/status/${stream_id}" \
        --header "Authorization: Bearer ${token}" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['isActive'])"
)
sleep 1

# Delete stream
curl --location --request DELETE "http://localhost:4000/api/streams/${stream_id}" \
    --header "Authorization: Bearer ${token}"
sleep 1

# Delete Camera
curl --location --request DELETE "http://localhost:4000/api/cameras/${stream_id}" \
    --header "Authorization: Bearer ${token}"
sleep 1

# Delete the user
psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'DELETE FROM public."Users" WHERE "email"=$$test@datakaveri.org$$'

docker container stop stream-server
docker rm stream-server


echo "Successfully passed: ${stream_status}"