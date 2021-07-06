# IUDX Video Server Backend

Backend Application for IUDX Video Server.

## Get Started

### Prerequisite - Make configuration

1. Clone this repo and change directory:

   ```sh
   git clone https://github.com/datakaveri/iudx-video-backend.git && cd iudx-video-backend
   ```

2. Create a `.env` file in the root directory of the project based on the template given below:

    ```sh
    NODE_ENV=development
    HOST_NAME=localhost
    HOST_TYPE=LMS
    PORT=4000
    POSTGRES_INITDB_USERNAME=user
    POSTGRES_INITDB_PASSWORD=user@123
    POSTGRES_INITDB_DATABASE=test_db
    DB_URL=postgresql://user:user@123@localhost:5555/test_db
    PGADMIN_DEFAULT_EMAIL=user@datakaveri.org
    PGADMIN_DEFAULT_PASSWORD=user@123
    EMAIL_ID=user@datakaveri.org
    EMAIL_PASSWORD=user@123
    JWT_SECRET=NO_SECRET
    JWT_PRIVATE_KEY_PATH=/path/to/file/sample.key
    RTMP_SERVER=rtmp://localhost:6001/live
    RTMP_SERVER_PUBLISH_PASSWORD=user123
    RTMP_STAT_URL=http://localhost:6002/stat
    ENABLE_STATUS_CHECK=true
    INITIALIZE_STREAMS=false
    SERVER_ID=54d6f331-6a8f-5362-9932-00609b42902f # UUID
    ```

### Setup

1. Install docker and docker-compose (one time setup).
2. Build necessary docker images:

    ```sh
    # Change path to scripts directory
    cd ./setup/scipts/

    # Build necessary docker images
    ./build_all.sh
    ```

### Local Media Server (LMS) setup

This setup takes care of setting up Nginx RTMP server, Postgresql and Video server.

1. Execute the LMS script.

    ```sh
    # Change path to scripts directory
    cd ./setup/scipts/

    # Run LMS script
    ./setup_lms.sh
    ```

To bring down LMS, run `./stop_lms.sh`.

### Cloud Media Server (CMS) setup

This setup takes care of setting up Zookeeper, Kafka, Nginx RTMP server, Postgresql and Video server.

1. Execute the CMS script.

    ```sh
    # Change path to scripts directory
    cd ./setup/scipts/

    # Run CMS script
    ./setup_cms.sh
    ```

To bring down CMS, run `./stop_cms.sh`.

### Starting backend server in Development/Deployment environment

#### Docker

Setting up `LMS/CMS` will bring up the backend server.

#### local

Run `npm start` from the project directory to start the server.

### Fine tuning

#### Zookeeper fine tuning

1. `cd ./setup/setup/zookeeper`
2. Edit zookeeper settings as required in `docker-compose.yml`.
3. `docker-compose up -d`

#### Kafka fine tuning

1. Ensure `zookeeper` is visible in the docker network
2. `cd ./setup/setup/kafka/`
3. Edit configuration in `docker-compose.yml` such as zookeeper service name and address, and `KAFKA_ADVERTISED_LISTENERS` for visibility outside the container.  
4. `docker-compose up -d`

#### Postgresql fine tuning

1. `cd ./setup/setup/postgres`
2. Edit postgres settings as required in `docker-compose.yml`.  
3. `docker-compose up -d`

### Testing

#### Unit tests

1. Run the server.
2. Run the unit tests using command `npm test`.
