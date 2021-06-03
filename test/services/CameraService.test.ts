import 'reflect-metadata';


import Container from 'typedi';
import _ from 'lodash';
import CameraService from '../../src/services/CameraService';


jest.mock('../../src/repositories/CameraRepo');

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
            mockCameraData[0]['userId'] = '3';

            await expect(cameraService.register(mockCameraData)).resolves;
        });

        test('Should throw error if user registers duplicate camera', async () => {
            const expected: string = 'Error Registering the data';

            mockCameraData[0]['userId'] = '1';

            await expect(cameraService.register(mockCameraData)).rejects.toThrowError(expected);
        });

    });

    describe('Find a camera', () => {

        test('Should return the camera data', async () => {
            const expected: any = {
                cameraNum: expect.any(Number),
                cameraName: expect.any(String),
                cameraType: expect.any(String),
                cameraUsage: expect.any(String),
                cameraOrientation: expect.any(String),
                city: expect.any(String),
                location: expect.any(String),
            };

            const userid: string = '1';
            const cameraName: string = 'camera_1';

            await expect(cameraService.findOne(userid, cameraName)).resolves.toEqual(
                expect.objectContaining(expected)
            );
        });

        test('Should return null if data not found', async () => {
            const userid: string = '1';
            const cameraName: string = 'camera_10';

            await expect(cameraService.findOne(userid, cameraName)).resolves.toBeNull();
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

        test('Should update a camera', async () => {
            const expected: Array<number> = [1];

            const userid: string = '1';
            const cameraName: string = 'camera_1';

            await expect(cameraService.update(userid, cameraName, param)).resolves.toEqual(
                expect.arrayContaining(expected)
            );
        });

        test('Should not update if camera not found', async () => {
            const expected: Array<number> = [0];

            const userid: string = '1';
            const cameraName: string = 'camera_100';

            await expect(cameraService.update(userid, cameraName, param)).resolves.toEqual(
                expect.arrayContaining(expected)
            );
        });

        test('Should not update if it is invalid user', async () => {
            const expected: Array<number> = [0];

            const userid: string = '0';
            const cameraName: string = 'camera_1';

            await expect(cameraService.update(userid, cameraName, param)).resolves.toEqual(
                expect.arrayContaining(expected)
            );
        });

    });

    describe('Delete Camera', () => {

        test('Should delete a camera', async () => {
            const expected: Array<number> = [1];

            const userid: string = '1';
            const cameraName: string = 'camera_1';

            await expect(cameraService.delete(userid, cameraName)).resolves.toEqual(
                expect.arrayContaining(expected)
            );
        });

        test('Should not delete if camera not found', async () => {
            const expected: Array<number> = [0];

            const userid: string = '1';
            const cameraName: string = 'camera_100';

            await expect(cameraService.delete(userid, cameraName)).resolves.toEqual(
                expect.arrayContaining(expected)
            );
        });

        test('Should not delete if it is invalid user', async () => {
            const expected: Array<number> = [0];

            const userid: string = '0';
            const cameraName: string = 'camera_1';

            await expect(cameraService.delete(userid, cameraName)).resolves.toEqual(
                expect.arrayContaining(expected)
            );
        });
    });
});
