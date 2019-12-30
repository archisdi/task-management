import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User Entity', () => {
    let user: User;

    beforeEach(() => {
        user = new User();
        user.password = 'password';
        user.salt = 'salt';
        bcrypt.hash = jest.fn();
    });

    describe('validatePasword', () => {

        it('returns true if password valid', async () => {
            bcrypt.hash.mockReturnValue('password');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('123456');
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'salt');
            expect(result).toEqual(true);
        });

        it('returns false if password invalid', async () => {
            bcrypt.hash.mockReturnValue('password123');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('123456');
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'salt');
            expect(result).toEqual(false);
        });

    });

});
