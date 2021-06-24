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

printf "\n\n\n"

# Register the user
printf " \u2022 Registering test user\n"
curl -sS --location --request POST 'http://localhost:4000/api/auth/signup' --header 'Content-Type: application/json' --data-raw "$(getUserData)"

sleep 2
printf "\n\n \u2714 \033[0;32m Registered test user\033[0m\n"

# Verify the user
printf "\n\n \u2022 Verifying test user\n"
code=$(psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'SELECT "verificationCode" FROM public."Users" WHERE email=$$test@datakaveri.org$$')

updated_code=$(echo "${code}" | xargs)

curl -sS --location --request GET "http://localhost:4000/api/auth/verify?verificationCode=${updated_code}"
sleep 2
printf "\n\n \u2714 \033[0;32m Verified test user\033[0m\n"

# Get Token
printf "\n\n \u2022 Generating Token\n"
token=$(
    curl -sS --location --request POST 'http://localhost:4000/api/auth/token' \
        --header 'Content-Type: application/json' --data-raw "$(getTokenData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['token'])"
)

sleep 1
printf " \u2714 \033[0;32m Token Generated Successfully \033[0m\n\n"

# Register Camera
printf "\n \u2022 Registering a camera\n"
camera_id=$(
    curl -sS --location --request POST 'http://localhost:4000/api/cameras' \
        --header "Authorization: Bearer ${token}" \
        --header 'Content-Type: application/json' \
        --data-raw "$(getCameraData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['cameraId'])"
)

sleep 1
printf " \u2714 \033[0;32m Successfully registered a test camera\033[0m\n"


# Camera List API
printf "\n \u2022 Camera List\n"
curl -sS --location --request GET 'http://localhost:4000/api/cameras?size=8&page=1' --header "Authorization: Bearer ${token}" | python3 -m json.tool



printf "\n \u2022 Creating test streaming server\n"
docker run --name stream-test -d -p 8554:8554 stream-server

sleep 5
printf " \u2714 \033[0;32m Streaming server created successfully\033[0m\n"

# Registering a stream
printf "\n \u2022 Registering a stream\n"
stream_id=$(
    curl -sS --location --request POST 'http://localhost:4000/api/streams' \
        --header "Authorization: Bearer ${token}" \
        --header 'Content-Type: application/json' \
        --data-raw "$(getStreamData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['streamId'])"
)
printf " \u2714 \033[0;32m Registered the stream\033[0m\n"

printf "\n \u2022 Stream List\n"
curl -sS --location --request GET 'http://localhost:4000/api/streams?size=7&page=1' --header "Authorization: Bearer ${token}" | python3 -m json.tool

sleep 2

# Check stream status
printf "\n \u2022 Checking status of the stream\n"

counter=0
max_counter=30

stream_status=''
while [ $counter -lt $max_counter ]
do
    stream_res=$(
        curl -sS --location --request GET "http://localhost:4000/api/streams/status/${stream_id}" \
            --header "Authorization: Bearer ${token}"
    )

    echo $stream_res | python3 -m json.tool
    stream_status=$(echo $stream_res | python3 -c "import sys, json; print(json.load(sys.stdin)['results'][0]['isActive'])")
    sleep 1
    if [ "$stream_status" == "True" ]; then
        printf "\n\n\n \u2714 \033[0;32m Stream published successfully\033[0m \n"
        break
    # else
    #     printf "\n\n\n \u274c \033[0;31m Stream failed to publish\033[0m \n"
    fi
    counter=`expr $counter + 1`
    printf "\n"
done

if [ "$stream_status" == "True" ]; then
    printf "\n\n\n \u2714 \033[0;32m Stream published successfully\033[0m \n"
    break
else
    printf "\n\n\n \u274c \033[0;31m Stream failed to publish\033[0m \n"
fi

# cleanup

printf "\n \u2022 Cleaning...\n"
# Delete stream
curl -sS --location --request DELETE "http://localhost:4000/api/streams/${stream_id}" \
    --header "Authorization: Bearer ${token}"
sleep 1

printf "\n"

# Delete Camera
curl -sS --location --request DELETE "http://localhost:4000/api/cameras/${camera_id}" \
    --header "Authorization: Bearer ${token}"
sleep 1

printf "\n"
# Delete the user
psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'DELETE FROM public."Users" WHERE "email"=$$test@datakaveri.org$$'

docker container stop stream-test
docker rm stream-test


printf "\n \u2714 \033[0;32m Cleaning Completed"
# Show test result

if [ "$stream_status" == "True" ]; then
    printf "\n\n\n \u2714 \033[0;32m Stream creation flow passed\033[0m \n"
else
    printf "\n\n\n \u274c \033[0;31m Stream creation failed\033[0m \n"
fi
