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

            const userId: string = '1';
            const cameraId: string = '1';

            await expect(cameraService.findOne(userId, cameraId)).resolves.toStrictEqual(expected);
        });

        test('Should resolve and return null if camera not found', async () => {
            const userId: string = '1';
            const cameraId: string = '10';

            await expect(cameraService.findOne(userId, cameraId)).resolves.toBeNull();
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

            const userId: string = '1';
            const cameraId: string = '1';

            await expect(cameraService.update(userId, cameraId, param)).resolves.toStrictEqual(expected);
        });

        test('Should resolve and return null if camera not found', async () => {
            const userId: string = '1';
            const cameraId: string = '100';

            await expect(cameraService.update(userId, cameraId, param)).resolves.toBeNull();
        });

        test('Should resolve and return null if it is invalid user', async () => {
            const userId: string = '0';
            const cameraId: string = '1';

            await expect(cameraService.update(userId, cameraId, param)).resolves.toBeNull();
        });

    });

    describe('Delete Camera', () => {

        test('Should reolves promise and delete the camera', async () => {
            const expected: number = 1;

            const userId: string = '1';
            const cameraId: string = '1';

            await expect(cameraService.delete(userId, cameraId)).resolves.toEqual(expected);
        });

        test('Should resolve and return 0 if camera not registered', async () => {
            const expected: number = 0;

            const userId: string = '1';
            const cameraId: string = '100';

            await expect(cameraService.delete(userId, cameraId)).resolves.toEqual(expected);
        });

        test('Should resolve and return 0 if it is invalid user', async () => {
            const expected: number = 0;

            const userId: string = '0';
            const cameraId: string = '1';

            await expect(cameraService.delete(userId, cameraId)).resolves.toEqual(expected);
        });
    });
});
