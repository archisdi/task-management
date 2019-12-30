import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockCredential = {
    username: 'username',
    password: 'username',
};

describe('UserRepository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ],
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {
        let saveMock;
        beforeEach(() => {
            saveMock = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save: saveMock });
        });

        it('successfuly sign up user', () => {
            saveMock.mockResolvedValue(undefined);
            expect(userRepository.createUser(mockCredential)).resolves.not.toThrow();
        });

        it('throw ConflictException if user exsist', () => {
            saveMock.mockRejectedValue({ code: '23505' });
            expect(userRepository.createUser(mockCredential)).rejects.toThrow(ConflictException);
        });

        it('throw InternalServerErrorException if any unhandled error found', () => {
            saveMock.mockRejectedValue({ code: '666' });
            expect(userRepository.createUser(mockCredential)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('validateUserPassword', () => {
        let validatePasswordMock;
        beforeEach(() => {
            validatePasswordMock = jest.fn();
            userRepository.findOne = jest.fn().mockReturnValue({ username: 'username', validatePassword: validatePasswordMock });
        });

        it('return username if user password valid', async () => {
            validatePasswordMock.mockResolvedValue(true);

            const result = await userRepository.validateUserPassword(mockCredential);
            expect(result).toEqual('username');
        });

        it('return null if user password invalid', async () => {
            validatePasswordMock.mockResolvedValue(false);

            const result = await userRepository.validateUserPassword(mockCredential);
            expect(result).toEqual(null);
        });

        it('return null if user is not found', async () => {
            userRepository.findOne = jest.fn().mockReturnValue(null);

            const result = await userRepository.validateUserPassword(mockCredential);
            expect(result).toEqual(null);
        });
    });
});
