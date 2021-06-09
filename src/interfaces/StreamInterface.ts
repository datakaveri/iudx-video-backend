export interface StreamInterface {
    streamId: string,
    userId: string,
    cameraId: string;
    sourceServerId: number;
    destinationServerId: number;
    processId: number;
    streamName: string;
    streamUrl: string;
    streamType: string;
    isPublic: boolean;
    isActive: boolean;
    isPublishing: boolean;
    isStable: boolean;
    totalClients: number;
    lastActive: Date;
}