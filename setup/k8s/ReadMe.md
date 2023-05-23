# IUDX Video Server Backend Deployment

1. Deploy Zookeeper:-

    ```sh
    # Change to Zookeeper directory
    cd ./zookeeper/

    # Create Zookeeper secret 
    kubectl apply -f zookeeper-jass-secret.yaml

    # Create Zookeeper StatefulSet
    kubectl apply -f zookeeper-statefulset.yaml

    # Create Zookeeper Service
    kubectl apply -f zookeeper-service.yaml   
    ```

2. Deploy Kafka:-

    ```sh
    # Change to kafka directory
    cd ./kafka/

    # Create kafka secret 
    kubectl apply -f kafka-jass-secret.yaml

    # Create kafka StatefulSet
    kubectl apply -f kafka-statefulset.yaml

    # Create kafka Service
    kubectl apply -f kafka-service.yaml
    ```     

3. Deploy Postgres:-

    ```sh
    # Change to postgres directory
    cd ./postgres/

    # Create configmap of db schema
    kubectl apply -f schema-config.yaml

    # Create volume claims of postgres and pgadmin
    kubectl apply -f pgdata-pvc.yaml
    kubectl apply -f pgadmin-pvc.yaml

    # Create postgres and pgadmin deployements
    kubectl apply -f postgres-deployment.yaml
    kubectl apply -f pgadmin-deployment.yaml

    # Create services of postgres and pgadmin
    kubectl apply -f postgres-ip-service.yaml
    kubectl apply -f pgadmin-ip-service.yaml
    ```

4. Deploy nginx:-

    ```sh

    # Create nginx configmap
    kubectl apply -f nginx-configmap.yaml

    # Create nginx deployment
    kubectl apply -f nginx-deployment.yaml 
    ```

5. Deploy nginx-rtmp:-   

    ```sh

    # Create nginx-rtmp deployment
    kubectl apply -f nginxrtmp-deployment.yaml

    # Create nginx-rtmp service
    kubectl apply -f nginxrtmp-ip-service.yaml
    ```

6. Deploy Video Server:-

    ```sh

    # Create video-server Ingress
    kubectl apply -f videoserver-ingress.yaml

    # Create Video-server deployment
    kubectl apply -f videoserver-deployment.yaml

    # Create video-server service
    kubectl apply -f videoserver-ip-service.yaml
    ```