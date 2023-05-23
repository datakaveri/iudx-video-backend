<!-- # IUDX Video Server Backend Deployment

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
    ``` -->

# Mediamtx Benchmark

1. Change into the mediamtx directory

    ```sh
    cd ../setup/k8s/mediamtx
    ```
2. Install Helm Chart.

    ```sh
    helm install mychart
    ```
3. To handle with the dynamic load on RTSP server, we need to autoscale our RTSP deployment (as per the requirement). To do that, we need to use the metrics-server. Download the configuration file of metrics server from official website.        

    ```sh
    wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
    ```
4. Edit downloaded file and add ```sh - --kubelet-insecure-tls``` to args list.

<p align="center">
<img src="../docs/diagrams/metric-server-config.png">
</p>

5. Deploy the metrics server on kubernetes.

    ```sh
    kubectl apply -f components.yaml 
    ```
6. Add hostNetwork: true to the spec of your metrics-server deployment by executing the following command:

    ```sh
    kubectl edit deployment -n kube-system metrics-server
    ```
7. It should look like the following:-

<p align="center">
<img src="../docs/diagrams/metrics-server-deployment-config.png">
</p>

8. Check the status of HPA, it should be something like:-

<p align="center">
<img src="../docs/diagrams/hpa-status.png">
</p>

9. Access the RTSP server from outside by port-forwarding:-

    ```sh
    kubectl port-forward deployments/rtsp 8554:8554
    ```

10. Let’s push a real-time-stream from local to RTSP server:-

   ```sh
   ffmpeg -ss 00:01 -rtsp_transport tcp -i rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4 -c copy -f rtsp -rtsp_transport tcp rtsp://localhost:8554/mystream
   ```

11. Access this stream from another terminal:-

   ```sh
   vlc rtsp://localhost:8554/mystream
   ```

12. Results:-

<p align="center">
<img src="../docs/diagrams/Result-1.png">

<img src="../docs/diagrams/result-2.png">

<img src="../docs/diagrams/result-3.png">

<img src="../docs/diagrams/result-4.png">
</p>

13. Resources used by RTSP server(pod) for single publisher and single subscriber:-

<p align="center">
<img src="../docs/diagrams/pod-resource-status.png">
</p>

14. Resource limits and request:-

<p align="center">
<img src="../docs/diagrams/resource-config.png">
</p>