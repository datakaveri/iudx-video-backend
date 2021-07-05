import { Service } from 'typedi';
import _ from 'lodash';

import { Cameras } from '../../../test/data/Cameras';

@Service()
export default class CameraRepo {
    public registerCamera: any = jest.fn().mockImplementation((cameraData: any) => {
        return cameraData;
    });

    public findCamera: any = jest.fn().mockImplementation((query: any) => {
        const camera = _.find(Cameras, (obj) => {
            return (query.userId ? obj.userId === query.userId : true) &&
                (query.cameraId ? obj.cameraId === query.cameraId : true);
        });

        if (!camera) {
            return null;
        }

        return _.omit(camera, ['userId']);;
    });

    public listAllCameras: any = jest.fn().mockImplementation((limit: number, offset: number) => {
        return {
            count: Cameras.length,
            rows: Cameras.slice(offset, limit),
        }
    });

    public updateCamera: any = jest.fn().mockImplementation((data: any, query: any, columns: Array<string> = []) => {
        const result = _.find(Cameras, (obj) => {
            return (query.userId ? obj.userId === query.userId : true) &&
                (query.cameraId ? obj.cameraId === query.cameraId : true);
        });

        if (!result) {
            return [0];
        }

        return [1, _.omit(result, ['userId'])];
    });

    public deleteCamera: any = jest.fn().mockImplementation((query: any) => {
        const result = _.find(Cameras, (obj) => {
            return (query.userId ? obj.userId === query.userId : true) &&
                (query.cameraId ? obj.cameraId === query.cameraId : true);
        });

        if (!result) {
            return 0;
        }

        return 1;
    });
}