import prometheusClient from 'prom-client';

const numOfRequests = new prometheusClient.Counter({
    name: 'num_of_requests',
    help: 'Number of requests made to the video server',
    labelNames: ['method', 'route']
});

const httpRequestDetails = new prometheusClient.Summary({
    name: 'http_request_details',
    help: 'Details of HTTP requests to the video server',
    labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new prometheusClient.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests to the video server (in ms)',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.0025, 0.005, 0.025, 0.5, 1, 10, 100, 500, 1000, 5000]
});


export default {
    numOfRequests,
    httpRequestDetails,
    httpRequestDuration,
}