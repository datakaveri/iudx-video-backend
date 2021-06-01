export interface CameraInterface {
    cameraId: number,
    userId: number,
    cameraNum: number;
    cameraName: string;
    streamName: string;
    streamUrl: string;
    cameraType: string;
    cameraUsage: string;
    cameraOrientation: string;
    city: string;
    location: string;
    active: boolean;
    publishing: boolean;
    stable: boolean;
}
