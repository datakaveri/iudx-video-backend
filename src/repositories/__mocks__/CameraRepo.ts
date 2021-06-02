import { Service } from 'typedi';
import _ from 'lodash';

import { Cameras } from '../../../test/data/Cameras';

@Service()
export default class CameraRepo {
    public registerCamera: any = jest.fn().mockImplementation((cameraData: any) => {
        for (const data of cameraData) {
            const isDuplicate = _.find(Cameras, {
                userId: data.userId,
                cameraName: data.cameraName
            });
            if (isDuplicate) {
                throw new Error();
            }
        }

        return true;
    });

    public findCamera: any = jest.fn().mockImplementation((userId: string, cameraName: string) => {
        const cameraData = _.find(Cameras, (obj) => {
            return obj.userId === userId && obj.cameraName === cameraName;
        });

        if (!cameraData) {
            return null;
        }

        return cameraData;
    });

    public listAllCameras: any = jest.fn().mockImplementation((limit: number, offset: number) => {
        const data = Cameras.slice(offset, limit);

        return {
            count: Cameras.length,
            rows: data
        }
    });

    public updateCamera: any = jest.fn().mockImplementation((userId: string, cameraName: string, params: any) => {
        const cameraData = _.find(Cameras, (obj) => {
            return obj.userId === userId && obj.cameraName === cameraName;
        });

        if (!cameraData) {
            return [0];
        }

        return [1];
    });

    public deleteCamera: any = jest.fn().mockImplementation((userId: string, cameraName: string) => {
        const cameraData = _.find(Cameras, (obj) => {
            return obj.userId === userId && obj.cameraName === cameraName;
        });

        if (!cameraData) {
            return [0];
        }

        return [1];
    });
}
