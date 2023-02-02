import 'reflect-metadata';


import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import passport from '../../src/common/Passport';

jest.mock('../../src/repositories/UserRepo');

describe('Passport Strategy Test', () => {
    describe('SignUp Strategy', () => {
        let mockRequest: Partial<Request>;
        let mockResponse: Partial<Response>;
        let nextFunction: NextFunction = jest.fn();

        beforeEach(() => {
            mockResponse = {};
        });

        test('New Data Provided', async () => {
            mockRequest = {
                body: {
                    name: 'New',
                    email: 'newuser@datakaveri.org',
                    password: 'admin',
                    role: 'consumer',
                },
                query: {
                }
            };
            passport.authenticate('signup', (err, code) => {
                expect(err).toBeFalsy();
                expect(code).toBeTruthy();
            })(mockRequest, mockResponse, nextFunction);
        });

        test('Existing Data Provided', () => {
            mockRequest = {
                body: {
                    name: 'Swarup E',
                    email: 'swarup@datakaveri.org',
                    password: 'admin',
                    role: 'provider',
                },
            };
            passport.authenticate('signup', (err, code) => {
                expect(err).toBeTruthy();
            })(mockRequest, mockResponse, nextFunction);
        });
    });

    describe('Token Strategy', () => {
        let mockRequest: Partial<Request>;
        let mockResponse: Partial<Response>;
        let nextFunction: NextFunction = jest.fn();

        beforeEach(() => {
            mockResponse = {};
        });

        test('Non Existing User', () => {
            mockRequest = {
                body: {
                    email: 'newuser@datakaveri.org',
                    password: 'consumer',
                },
            };
            passport.authenticate('token', (err, token, message) => {
                expect(err).toBeTruthy();
                expect(token).toBeFalsy();
            })(mockRequest, mockResponse, nextFunction);
        });

        test('Existing User with Not verified', () => {
            mockRequest = {
                body: {
                    email: 'test@datakaveri.org',
                    password: 'admin123',
                },
            };
            passport.authenticate('token', (err, token, message) => {
                expect(err).toBeTruthy();
                expect(token).toBeFalsy();
            })(mockRequest, mockResponse, nextFunction);
        });

        test('Existing Verified User', () => {
            mockRequest = {
                body: {
                    email: 'swarup@datakaveri.org',
                    password: 'admin123',
                },
            };
            passport.authenticate('token', (err, token, message) => {
                expect(err).toBeFalsy();
                expect(token).toBeTruthy();
            })(mockRequest, mockResponse, nextFunction);
        });
    });

    describe('Verify Strategy', () => {
        let mockRequest: Partial<Request>;
        let mockResponse: Partial<Response>;
        let nextFunction: NextFunction = jest.fn();

        beforeEach(() => {
            mockResponse = {};
        });

        test('Valid verification code provided', () => {
            mockRequest = {
                query: {
                    verificationCode: '12345',
                },
            };
            const expectedResponse = { success: true, message: 'Verification successful' };
            passport.authenticate('verify', (err, data) => {
                expect(data).toEqual(expectedResponse);
            })(mockRequest, mockResponse, nextFunction);
        });

        test('Invalid verification code provided', () => {
            mockRequest = {
                query: {
                    verificationCode: 'xsahjdhsjahfj',
                },
            };
            const expectedResponse = { success: false, message: 'Wrong verification code provided' };
            passport.authenticate('verify', (err, data) => {
                expect(data).toEqual(expectedResponse);
            })(mockRequest, mockResponse, nextFunction);
        });
    });

    describe('JWT Middleware Strategy', () => {
        let mockRequest: Partial<Request>;
        let mockResponse: Partial<Response>;
        let nextFunction: NextFunction = jest.fn();

        beforeEach(() => {
            mockResponse = {};
        });

        test('With header', () => {
            mockRequest = {
                headers: {
                    Authorization: 'Bearer 12345',
                },
            };
            passport.authenticate('jwt', (err, user) => {
                expect(user);
            })(mockRequest, mockResponse, nextFunction);
        });

        test('Without header', () => {
            mockRequest = {
                headers: {},
            };
            passport.authenticate('jwt', (err, data) => {
                expect(err).toBeFalsy();
            })(mockRequest, mockResponse, nextFunction);
        });
    });
});
