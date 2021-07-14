import 'reflect-metadata';


import Container from 'typedi';
import _ from 'lodash';
import CameraService from '../../src/services/CameraService';


jest.mock('../../src/repositories/CameraRepo');
jest.mock('../../src/services/FfmpegService.ts');
jest.mock('../../src/repositories/StreamRepo');

const cameraService = Container.get(CameraService);

describe('Camera Service Testing', () => {

    describe('Register Camera', () => {

        const mockCameraData = [
            {
                cameraNum: 15,
                cameraName: 'camera_1',
                cameraType: 'DOME',
                cameraUsage: 'RLVD',
                cameraOrientation: 'NORTH-EAST',
                city: 'Bangalore',
                location: 'lat/long',
            },
        ];

        test('Should register the camera', async () => {
            const userId: string = '3';

            await expect(cameraService.register(userId, mockCameraData)).resolves;
        });

        test('Should resolve and return null if the camera already registered', async () => {
            const userId: string = '3';
            mockCameraData[0].cameraNum = 15758;

            await expect(cameraService.register(userId, mockCameraData)).resolves.toBeNull();
        });
    });

    describe('Find a camera', () => {

        test('Should return the camera data', async () => {
            const expected: any = {
                cameraId: expect.any(String),
                cameraNum: expect.any(Number),
                cameraName: expect.any(String),
                cameraType: expect.any(String),
                cameraUsage: expect.any(String),
                cameraOrientation: expect.any(String),
                city: expect.any(String),
                location: expect.any(String)
            };

            const cameraId: string = '1';

            await expect(cameraService.findOne(cameraId)).resolves.toStrictEqual(expected);
        });

        test('Should resolve and return null if camera not found', async () => {
            const cameraId: string = '10';

            await expect(cameraService.findOne(cameraId)).resolves.toBeNull();
        });

    });

    describe('List all associated streams', () => {

        test('Should return the streams data', async () => {
            const expected: any = {
                streamId: expect.any(String),
                provenanceStreamId: expect.any(String),
                streamName: expect.any(String),
                streamUrl: expect.any(String),
                streamType: expect.any(String),
                type: expect.any(String),
                isPublic: expect.any(Boolean),
            };

            const cameraId: string = '4';

            await expect(cameraService.listAssociatedStreams(cameraId)).resolves.toContainEqual(expected);
        });

        test('Should resolve and return null if camera not found', async () => {
            const cameraId: string = '10';

            await expect(cameraService.listAssociatedStreams(cameraId)).resolves.toBeNull();
        });

    });

    describe('Find all Camera', () => {

        test('Should return all camera data with default size 2', async () => {
            const expected: any = {
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                totalPages: expect.any(Number),
                results: expect.any(Array)
            };
            const page: number = 0;
            const size: number = 0;

            const response = await cameraService.findAll(page, size);

            expect(response).toEqual(
                expect.objectContaining(expected)
            );
            expect(response['results']).toHaveLength(2);
        });

        test('Should return correct page and size', async () => {
            const page: number = 1;
            const size: number = 4;

            const response = await cameraService.findAll(page, size);

            expect(response['currentPage']).toBe(page);
            expect(response['results']).toHaveLength(size);
        });

    });

    describe('Update Camera', () => {

        const param: any = {
            'cameraType': 'FIXED',
            'cameraUsage': 'SURVEILLANCE'
        };

        test('Should resolve promise and updates the camera', async () => {
            const expected: any = {
                cameraId: expect.any(String),
                cameraNum: expect.any(Number),
                cameraName: expect.any(String),
                cameraType: expect.any(String),
                cameraUsage: expect.any(String),
                cameraOrientation: expect.any(String),
                city: expect.any(String),
                location: expect.any(String)
            };
            const cameraId: string = '1';

            await expect(cameraService.update(cameraId, param)).resolves.toStrictEqual(expected);
        });

        test('Should resolve and return null if camera not found', async () => {
            const cameraId: string = '100';

            await expect(cameraService.update(cameraId, param)).resolves.toBeNull();
        });
    });

    describe('Delete Camera', () => {

        test('Should resolve and return 1 if camera is deleted', async () => {
            const expected: number = 1;
            const cameraId: string = '4';

            await expect(cameraService.delete(cameraId)).resolves.toEqual(expected);
        });

        test('Should resolve and return 0 if camera not registered', async () => {
            const expected: number = 0;
            const cameraId: string = '100';

            await expect(cameraService.delete(cameraId)).resolves.toEqual(expected);
        });
    });
});
