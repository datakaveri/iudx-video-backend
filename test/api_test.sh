#!/bin/bash

docker build -t stream-server ../setup/testimage

admin_email='admin@datakaveri.org'
admin_password='admin'

provider_email='provider@datakaveri.org'
provider_password='provider'

consumer_email='consumer@datakaveri.org'
consumer_password='consumer'

# SignUp Data
getAdminData() {
    cat <<EOF
{
    "name": "Test Admin User",
    "email": "$admin_email",
    "password": "$admin_password",
    "role": "admin"
}
EOF
}

getProviderData() {
    cat <<EOF
{
    "name": "Test Provider User",
    "email": "$provider_email",
    "password": "$provider_password",
    "role": "provider"
}
EOF
}

getConsumerData() {
    cat <<EOF
{
    "name": "Test Consumer User",
    "email": "$consumer_email",
    "password": "$consumer_password",
    "role": "consumer"
}
EOF
}

# Token Data
getAdminTokenData() {
    cat <<EOF
{
    "email": "$admin_email",
    "password": "$admin_password"
}
EOF
}

getProviderTokenData() {
    cat <<EOF
{
    "email": "$provider_email",
    "password": "$provider_password"
}
EOF
}

getConsumerTokenData() {
    cat <<EOF
{
    "email": "$consumer_email",
    "password": "$consumer_password"
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

# Policy Data
getPolicyData() {
    cat <<EOF
{
    "email": "$consumer_email",
    "streamId": "$stream_id"
}
EOF
}

printf "\n\n\n"

# Register the users
printf " \u2022 Registering admin, provider and consumer test users\n"
curl -sS --location --request POST 'http://localhost:4000/api/auth/signup' --header 'Content-Type: application/json' --data-raw "$(getAdminData)"
printf "\n"
curl -sS --location --request POST 'http://localhost:4000/api/auth/signup' --header 'Content-Type: application/json' --data-raw "$(getProviderData)"
printf "\n"
curl -sS --location --request POST 'http://localhost:4000/api/auth/signup' --header 'Content-Type: application/json' --data-raw "$(getConsumerData)"
printf "\n"

sleep 2
printf "\n\n \u2714 \033[0;32m Registered users\033[0m\n"

# Verify the user
printf "\n\n \u2022 Verifying admin, provider and consumer users\n"
admin_code=$(psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'SELECT "verificationCode" FROM public."Users" WHERE email=$$admin@datakaveri.org$$')
provider_code=$(psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'SELECT "verificationCode" FROM public."Users" WHERE email=$$provider@datakaveri.org$$')
consumer_code=$(psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'SELECT "verificationCode" FROM public."Users" WHERE email=$$consumer@datakaveri.org$$')

updated_admin_code=$(echo "${admin_code}" | xargs)
updated_provider_code=$(echo "${provider_code}" | xargs)
updated_consumer_code=$(echo "${consumer_code}" | xargs)

curl -sS --location --request GET "http://localhost:4000/api/auth/verify?verificationCode=${updated_admin_code}"
printf "\n"
curl -sS --location --request GET "http://localhost:4000/api/auth/verify?verificationCode=${updated_provider_code}"
printf "\n"
curl -sS --location --request GET "http://localhost:4000/api/auth/verify?verificationCode=${updated_consumer_code}"
printf "\n"
sleep 2
printf "\n\n \u2714 \033[0;32m Verified users\033[0m\n"

# Get Token
printf "\n\n \u2022 Generating Token\n"
admin_token=$(
    curl -sS --location --request POST 'http://localhost:4000/api/auth/token' \
        --header 'Content-Type: application/json' --data-raw "$(getAdminTokenData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['token'])"
)
provider_token=$(
    curl -sS --location --request POST 'http://localhost:4000/api/auth/token' \
        --header 'Content-Type: application/json' --data-raw "$(getProviderTokenData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['token'])"
)
consumer_token=$(
    curl -sS --location --request POST 'http://localhost:4000/api/auth/token' \
        --header 'Content-Type: application/json' --data-raw "$(getConsumerTokenData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['token'])"
)

sleep 1
printf " \u2714 \033[0;32m Token Generated Successfully \033[0m\n\n"

# Register Camera
printf "\n \u2022 Registering a camera\n"
camera_id=$(
    curl -sS --location --request POST 'http://localhost:4000/api/cameras' \
        --header "Authorization: Bearer ${provider_token}" \
        --header 'Content-Type: application/json' \
        --data-raw "$(getCameraData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['cameraId'])"
)

sleep 1
printf " \u2714 \033[0;32m Successfully registered a test camera\033[0m\n"

# Camera List API
printf "\n \u2022 Camera List\n"
curl -sS --location --request GET 'http://localhost:4000/api/cameras?size=8&page=1' --header "Authorization: Bearer ${consumer_token}" | python3 -m json.tool

printf "\n \u2022 Creating test streaming server\n"
docker run --name stream-test -d -p 8554:8554 stream-server

sleep 5
printf " \u2714 \033[0;32m Streaming server created successfully\033[0m\n"

# Registering a stream
printf "\n \u2022 Registering a stream\n"

camera_stream_id=$(
    curl -sS --location --request POST 'http://localhost:4000/api/streams' \
        --header "Authorization: Bearer ${provider_token}" \
        --header 'Content-Type: application/json' \
        --data-raw "$(getStreamData)" | python3 -c \
        "import sys, json; print(json.load(sys.stdin)['results'][0]['streamId'])"
)

printf "\n \u2714 \033[0;32m Registered the stream\033[0m\n"

printf "\n \u2022 Stream List\n"
stream_list=$(
    curl -sS --location --request GET "http://localhost:4000/api/streams?size=7&page=1" --header "Authorization: Bearer ${consumer_token}"
)

echo $stream_list | python3 -m json.tool
stream_id=$(echo $stream_list| python3 -c \
    "import sys, json; print(json.load(sys.stdin)['results']['results'][1]['streamId'])"
)
sleep 2

# Create policy for the consumer
printf "\n \u2022 Creating consumer policy for a stream\n"
curl -sS --location --request POST 'http://localhost:4000/api/policy' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${provider_token}" --data-raw "$(getPolicyData)"

sleep 1
printf "\n \u2714 \033[0;32m Policy registered\033[0m\n"


# Check stream status
printf "\n \u2022 Checking status of the stream\n"

counter=0
max_counter=30

stream_status=''
while [ $counter -lt $max_counter ]; do
    stream_res=$(
        curl -sS --location --request GET "http://localhost:4000/api/streams/status/${stream_id}" \
            --header "Authorization: Bearer ${consumer_token}"
    )

    echo $stream_res | python3 -m json.tool
    stream_status=$(echo $stream_res | python3 -c "import sys, json; print(json.load(sys.stdin)['results'][0]['isActive'])")
    sleep 1
    if [ "$stream_status" == "True" ]; then
        printf "\n\n\n \u2714 \033[0;32m Stream published successfully\033[0m \n"
        break
    fi
    counter=$(expr $counter + 1)
    printf "\n"
done

if [ "$stream_status" == "True" ]; then
    printf "\n\n\n \u2714 \033[0;32m Stream published successfully\033[0m \n"
else
    printf "\n\n\n \u274c \033[0;31m Stream failed to publish\033[0m \n"
fi

# Stream Playback
printf "\n \u2022 Calling Stream Playback URL\n"

playback_res=$(
    curl -sS --location --request GET "http://localhost:4000/api/streams/playback/${stream_id}" \
        --header "Authorization: Bearer ${consumer_token}"
)
sleep 1
echo $playback_res | python3 -m json.tool
printf "\n \u2714 \033[0;32m Completed pyayback API request\033[0m\n"


# cleanup

printf "\n \u2022 Cleaning...\n"

#Delete  the policy
curl -sS --location --request DELETE 'http://localhost:4000/api/policy' \
--header "Authorization: Bearer ${provider_token}" \
--header 'Content-Type: application/json' \
--data-raw "$(getPolicyData)"

printf "\n"

# Delete stream
curl -sS --location --request DELETE "http://localhost:4000/api/streams/${camera_stream_id}" \
    --header "Authorization: Bearer ${provider_token}"
sleep 1

printf "\n"

# Delete Camera
curl -sS --location --request DELETE "http://localhost:4000/api/cameras/${camera_id}" \
    --header "Authorization: Bearer ${provider_token}"
sleep 1

printf "\n"
# Delete the user
psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'DELETE FROM public."Users" WHERE "email"=$$admin@datakaveri.org$$'
psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'DELETE FROM public."Users" WHERE "email"=$$provider@datakaveri.org$$'
psql -t postgresql://user:user%40123@localhost:5432/vs_db -c 'DELETE FROM public."Users" WHERE "email"=$$consumer@datakaveri.org$$'

docker container stop stream-test
docker rm stream-test

printf "\n \u2714 \033[0;32m Cleaning Completed"

# Show test result

if [ "$stream_status" == "True" ]; then
    printf "\n\n\n \u2714 \033[0;32m Stream creation flow passed\033[0m \n"
else
    printf "\n\n\n \u274c \033[0;31m Stream creation failed\033[0m \n"
fi
