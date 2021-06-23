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
    RTMP_SERVER_STAT_PORT=6002
    ENABLE_STATUS_CHECK=false
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

### Kafka setup

This setup takes care of setting up Zookeeper and Kafka.

1. Execute the Kafka script. This brings up kafka and zookeeper.

    ```sh
    # Change path to scripts directory
    cd ./setup/scipts/

    # Run Kafka script
    ./setup_kafka.sh
    ```

To bring down kafka, run `./stop_kafka.sh`.

### Postgres setup

This setup takes care of setting up Postgresql database.

1. Execute the db script. This brings up postgres service.

    ```sh
    # Change path to scripts directory
    cd ./setup/scipts/

    # Run Postregsql script
    ./setup_db.sh
    ```

To bring down postgres, run `./stop_db.sh`.

### Starting backend server in Development/Deployment environment

#### Docker

1. Execute the server script. This brings up backend server.

    ```sh
    # Change path to scripts directory
    cd ./setup/scipts/

    # Run server script
    ./setup_server.sh
    ```

To bring down server, run `./stop_server.sh`.

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
