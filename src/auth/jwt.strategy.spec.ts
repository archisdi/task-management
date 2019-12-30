import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
    findOne: jest.fn(),
});

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [JwtStrategy, { provide: UserRepository, useFactory: mockUserRepository }],
        }).compile();

        jwtStrategy =  module.get<JwtStrategy>(JwtStrategy);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe('validate', () => {
        it('return user if valid', async () => {
            const user = new User();
            user.username = 'username';
            userRepository.findOne.mockResolvedValue(user);

            const result = await jwtStrategy.validate({ username: user.username });

            expect(userRepository.findOne).toBeCalledWith({ username: user.username });
            expect(result).toEqual(user);
        });

        it('throw UnauthorizedException if invalid', async () => {
            userRepository.findOne.mockResolvedValue(null);
            expect(jwtStrategy.validate({ username: 'username' })).rejects.toThrow(UnauthorizedException);
        });
    });
});
