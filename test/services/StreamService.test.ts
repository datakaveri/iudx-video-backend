import 'reflect-metadata';


import Container from 'typedi';
import _ from 'lodash';
import StreamService from '../../src/services/StreamService';

jest.mock('../../src/repositories/StreamRepo');
jest.mock('../../src/repositories/CameraRepo');
jest.mock('../../src/repositories/ServerRepo');
jest.mock('../../src/services/ProcessService');
jest.mock('../../src/services/FfmpegService.ts');

const streamService = Container.get(StreamService);

describe('Stream Service Testing', () => {

    describe('Register Stream', () => {

        const mockStreamData = {
            cameraId: '1',
            streamName: 'test_stream_3',
            streamUrl: 'rtsp://testurl:777',
            streamType: 'RTSP',
            type: 'camera',
            isPublic: false,
        };

        test('Should register the stream', async () => {
            const userId: string = '1';

            await expect(streamService.register(userId, mockStreamData)).resolves;
        });

        test('Should resolve and return null if camera not registered', async () => {
            const userId: string = '1';
            mockStreamData['cameraId'] = '10';

            await expect(streamService.register(userId, mockStreamData)).resolves;
        });

    });

    describe('Find a stream', () => {

        test('Should return the stream data', async () => {
            const expected: any = {
                streamId: expect.any(String),
                cameraId: expect.any(String),
                streamName: expect.any(String),
                streamType: expect.any(String),
                streamUrl: expect.any(String),
                type: expect.any(String),
                isPublic: expect.any(Boolean),
            };
            const streamId: string = '1';

            await expect(streamService.findOne(streamId)).resolves.toStrictEqual(expected);
        });

        test('Should resolve and return not found if stream not available', async () => {
            const streamId: string = '10';

            await expect(streamService.findOne(streamId)).resolves;
        });

    });

    describe('Find all Stream', () => {

        test('Should return all stream data with default size 2', async () => {
            const expected: any = {
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                totalPages: expect.any(Number),
                results: expect.any(Array)
            };
            const page: number = 0;
            const size: number = 0;

            const response = await streamService.findAll(page, size);

            expect(response).toStrictEqual((expected));
            expect(response['results']).toHaveLength(2);
        });

        test('Should return correct page and size', async () => {
            const page: number = 1;
            const size: number = 3;

            const response = await streamService.findAll(page, size);

            expect(response['currentPage']).toBe(page);
            expect(response['results']).toHaveLength(size);
        });

    });

    describe('Delete Stream', () => {

        test('Should delete a stream and return 1', async () => {
            const expected: number = 1;
            const streamId: string = '2';

            await expect(streamService.delete(streamId)).resolves.toEqual(expected);
        });

        test('Should resolve and return 0 if stream not available', async () => {
            const expected: number = 0;
            const streamId: string = '10';

            await expect(streamService.delete(streamId)).resolves.toEqual(expected);
        });
    });

    describe('Check Stream Status', () => {

        test('Should resolve and return status object', async () => {
            const expected: any = {
                streamId: expect.any(String),
                cameraId: expect.any(String),
                provenanceStreamId: expect.any(String),
                streamName: expect.any(String),
                streamUrl: expect.any(String),
                type: expect.any(String),
                isActive: expect.any(Boolean),
            };
            const streamId: string = '1';

            await expect(streamService.getStatus(streamId)).resolves.toContainEqual(expected);
        });

        test('Should reject if stream not found', async () => {
            const streamId: string = '10';

            await expect(streamService.getStatus(streamId)).rejects.toThrowError();
        });
    });

});
