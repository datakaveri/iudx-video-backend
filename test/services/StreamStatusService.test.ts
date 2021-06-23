import 'reflect-metadata';

import Container from 'typedi';
import StreamStatusService from '../../src/services/StreamStatusService';
import got from 'got';

jest.mock('../../src/repositories/StreamRepo');
jest.mock('../../src/services/FfmpegService.ts');
jest.mock('got');

const streamStatusService = Container.get(StreamStatusService);

describe('Stream Status Service Testing', () => {

    describe('Check Stream Status', () => {

        test('Should resolve and return status object', async () => {
            const expected: any = {
                streamId: expect.any(String),
                cameraId: expect.any(String),
                streamName: expect.any(String),
                streamUrl: expect.any(String),
                type: expect.any(String),
                isActive: expect.any(Boolean),
            };

            const userId: string = '1';
            const streamId: string = '1';

            await expect(streamStatusService.getStatus(userId, streamId)).resolves.toContainEqual(expected);
        });

        test('Should reject if stream not found', async () => {
            const userId: string = '1';
            const streamId: string = '10';

            await expect(streamStatusService.getStatus(userId, streamId)).rejects.toThrowError();
        });

        test('Should reject if it is invalid user', async () => {
            const userId: string = '2';
            const streamId: string = '1';

            await expect(streamStatusService.getStatus(userId, streamId)).rejects.toThrowError();
        });
    });

    describe('Update Stream Status', () => {

        test('Should resolve and update stream status', async () => {
            const expected: any = {
                streamId: expect.any(String),
                cameraId: expect.any(String),
                streamName: expect.any(String),
                streamUrl: expect.any(String),
                type: expect.any(String),
                isActive: expect.any(Boolean),
            };

            const streamId: string = '1';
            const isActive: boolean = true;

            await expect(streamStatusService.updateStatus(streamId, isActive)).resolves.toStrictEqual(expected);
        });

        test('Should reject if stream not found', async () => {
            const streamId: string = '10';
            const isActive: boolean = true;

            await expect(streamStatusService.updateStatus(streamId, isActive)).rejects.toThrowError();
        });
    });

    describe('check status for streams', () => {

        test('Should return streams stats', async () => {
            const mockResponse =
                `<?xml version="1.0" encoding="utf-8" ?>
                <?xml-stylesheet type="text/xsl" href="stat.xsl" ?>
                <rtmp>
                <nginx_version>1.19.6</nginx_version>
                <nginx_rtmp_version>1.1.4</nginx_rtmp_version>
                <compiler>gcc 9.3.0 (Ubuntu 9.3.0-17ubuntu1~20.04) </compiler>
                <built>Jun 17 2021 10:34:52</built>
                <pid>7</pid>
                <uptime>22233</uptime>
                <naccepted>287</naccepted>
                <bw_in>559288</bw_in>
                <bytes_in>2473725413</bytes_in>
                <bw_out>0</bw_out>
                <bytes_out>64037351</bytes_out>
                <server>
                <application>
                <name>live</name>
                <live>
                <stream>
                <name>stream1</name>
                <time>20488789</time><bw_in>554176</bw_in>
                <bytes_in>2461500373</bytes_in>
                <bw_out>0</bw_out>
                <bytes_out>63274342</bytes_out>
                <bw_audio>141712</bw_audio>
                <bw_video>412456</bw_video>
                <client><id>102</id><address>172.22.0.1</address><time>20488793</time><flashver>FMLE/3.0 (compatible; Lavf58.45</flashver><dropped>0</dropped><avsync>17</avsync><timestamp>20488385</timestamp><publishing/><active/></client>
                <meta><video><width>1280</width><height>720</height><frame_rate>29</frame_rate><codec>H264</codec><profile>Main</profile><compat>64</compat><level>3.1</level></video><audio><codec>AAC</codec><profile>LC</profile><channels>2</channels><sample_rate>44100</sample_rate></audio></meta>
                <nclients>1</nclients>
                <publishing/>
                <active/>
                </stream>
                <nclients>1</nclients>
                </live>
                </application>
                </server>
                </rtmp>`;

            await got.get.mockResolvedValue({ body: mockResponse })
            await expect(streamStatusService.checkStatus()).resolves;
        });

    });

});
