import 'reflect-metadata';


import Container from 'typedi';
import _ from 'lodash';
import StreamService from '../../src/services/StreamService';

jest.mock('../../src/repositories/StreamRepo');
jest.mock('../../src/repositories/CameraRepo');

const streamService = Container.get(StreamService);

describe('Stream Service Testing', () => {

    describe('Register Stream', () => {

        const mockStreamData = [
            {
                cameraId: '1',
                streamName: 'test_stream_3',
                streamUrl: 'rtsp://testurl:777',
                streamType: 'RTSP',
                isPublic: false,
            },
        ];

        test('Should register the stream', async () => {
            const userId: string = '1';

            await expect(streamService.register(userId, mockStreamData)).resolves;
        });

        test('Should reject if camera not registered for a stream', async () => {
            const userId: string = '1';
            mockStreamData[0]['cameraId'] = '10';

            await expect(streamService.register(userId, mockStreamData)).rejects.toThrowError();
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
                isPublic: expect.any(Boolean),
            };

            const userId: string = '1';
            const streamId: string = '1';

            await expect(streamService.findOne(userId, streamId)).resolves.toStrictEqual(expected);
        });

        test('Should reject if data not found', async () => {
            const userId: string = '1';
            const streamId: string = '10';

            await expect(streamService.findOne(userId, streamId)).rejects.toThrowError();
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

        test('Should delete a stream', async () => {
            const userId: string = '1';
            const streamId: string = '1';

            await expect(streamService.delete(userId, streamId)).resolves;
        });

        test('Should reject if stream not found', async () => {
            const userId: string = '1';
            const streamId: string = '10';

            await expect(streamService.delete(userId, streamId)).rejects.toThrowError();
        });

        test('Should reject if it is invalid user', async () => {
            const userId: string = '2';
            const streamId: string = '1';

            await expect(streamService.delete(userId, streamId)).rejects.toThrowError();
        });
    });
});
