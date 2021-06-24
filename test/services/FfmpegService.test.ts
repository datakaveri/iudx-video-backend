import 'reflect-metadata';

import Container from 'typedi';
import fs from 'fs';
import FfmpegService from '../../src/services/FfmpegService';

const ffmpegService = Container.get(FfmpegService);

const mockInputData = {
    streamInputUrl: 'rtsp://localhost:8554/stream1',
    streamOutputUrl: 'rtmp://localhost:6001/live/stream1',
    pid: null,
    filepath: './temp.mp4',
    duration: 20,
    recordPid: null,
};

describe('Ffmpeg Service Test', () => {
    describe('Create Ffmpeg Process', () => {
        test('Should create the process', async () => {
            let result = await ffmpegService.createProcess(mockInputData.streamInputUrl, mockInputData.streamOutputUrl);
            expect(result).toBeGreaterThan(0);
            mockInputData.pid = result;
        });

        test('Should throw error for invalid input url', () => {
            let result = ffmpegService.createProcess('', mockInputData.streamOutputUrl);
            expect.assertions(1);
            expect(result).rejects.toThrowError();
        });

        test('Should throw error for invalid output url', () => {
            let result = ffmpegService.createProcess(mockInputData.streamInputUrl, '');
            expect.assertions(1);
            expect(result).rejects.toThrowError();
        });
    });

    describe('Is process running', () => {
        test('Should process be running', () => {
            let result = ffmpegService.isProcessRunning(mockInputData.pid);
            expect(result).resolves.toBeTruthy();
        });

        test('Should not process be running', () => {
            let result = ffmpegService.isProcessRunning(99999999999999999);
            expect(result).resolves.toBeFalsy();
        });

        test('Should throw error for invalid process id', () => {
            let result = ffmpegService.isProcessRunning(0);
            expect(result).rejects.toThrowError();
        });
    });


    describe('Is stream active', () => {
        test('Stream should be active', () => {
            let result = ffmpegService.isStreamActive(mockInputData.streamInputUrl);
            expect(result).resolves.toBeTruthy();
        });

        test('Stream should not be active', () => {
            let result = ffmpegService.isStreamActive(mockInputData.streamOutputUrl);
            expect(result).resolves.toBeFalsy();
        });

        test('Should throw error for invalid url', () => {
            let result = ffmpegService.isStreamActive('');
            expect(result).rejects.toThrowError();
        });
    });

    describe('Stream to file', () => {
        test('Should create the file', async () => {
            let result = await ffmpegService.streamToFile(mockInputData.streamInputUrl, mockInputData.filepath, mockInputData.duration);
            expect(result).toBeGreaterThan(0);
            setTimeout(() => {
                expect(fs.existsSync(mockInputData.filepath)).toBe(true);
            }, 5 * 1000);
            mockInputData.recordPid = result;
        });

        test('Should throw error for invalid url', () => {
            let result = ffmpegService.streamToFile('', mockInputData.filepath, mockInputData.duration);
            expect(result).rejects.toThrowError();
        });

        test('Should throw error for invalid duration', () => {
            let result = ffmpegService.streamToFile(mockInputData.streamInputUrl, mockInputData.filepath, 0);
            expect(result).rejects.toThrowError();
        });
    });

    describe('Kill running process', () => {
        test('Should process get killed', () => {
            let result = ffmpegService.killProcess(mockInputData.pid);
            expect(result).resolves.toBeTruthy();
        });

        test('Should throw error for process not found', () => {
            let result = ffmpegService.killProcess(99999999999999999);
            expect(result).rejects.toThrowError();
        });

        test('Should throw error for invalid process id', () => {
            let result = ffmpegService.killProcess(0);
            expect(result).rejects.toThrowError();
        });
    });
});

afterAll(async () => {
    await ffmpegService.killProcess(mockInputData.pid);
    await ffmpegService.killProcess(mockInputData.recordPid);
    if(fs.existsSync(mockInputData.filepath)) {
        fs.rmSync(mockInputData.filepath);
    }
});
