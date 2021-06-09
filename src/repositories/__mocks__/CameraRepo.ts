import { Service } from 'typedi';
import _ from 'lodash';

import { Cameras } from '../../../test/data/Cameras';

@Service()
export default class CameraRepo {
    public registerCamera: any = jest.fn().mockImplementation((cameraData: any) => {
        for (const data of cameraData) {
            const isDuplicate = _.find(Cameras, { cameraId: data.cameraId });
            if (isDuplicate) {
                throw new Error();
            }
        }

        return true;
    });

    public findCamera: any = jest.fn().mockImplementation((userId: string, cameraId: string) => {
        const cameraData = _.find(Cameras, (obj) => {
            return obj.userId === userId && obj.cameraId === cameraId;
        });

        if (!cameraData) {
            throw new Error();
        }

        return _.omit(cameraData, ['userId']);
    });

    public listAllCameras: any = jest.fn().mockImplementation((limit: number, offset: number) => {
        const data = Cameras.slice(offset, limit);
        const cameraData = _.map(data, (item) => {
            return _.omit(item, ['userId']);
        })

        return {
            count: Cameras.length,
            rows: cameraData
        }
    });

    public updateCamera: any = jest.fn().mockImplementation((userId: string, cameraId: string, params: any) => {
        const cameraData = _.find(Cameras, (obj) => {
            return obj.userId === userId && obj.cameraId === cameraId;
        });

        if (!cameraData) {
            throw new Error();
        }

        return _.omit(cameraData, ['userId']);
    });

    public deleteCamera: any = jest.fn().mockImplementation((userId: string, cameraId: string) => {
        const cameraData = _.find(Cameras, (obj) => {
            return obj.userId === userId && obj.cameraId === cameraId;
        });

        if (!cameraData) {
            throw new Error();
        }
    });
}
