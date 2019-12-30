import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCredential: AuthCredentialDto): Promise<void> {
        try {
            const { username, password } = authCredential;
            const salt = await bcrypt.genSalt();

            // const user = new User();
            const user = this.create();

            user.username = username;
            user.password = await this.hashPassword(password, salt);
            user.salt = salt;

            await user.save();
        } catch (err) {
            if (err.code === '23505') {
                throw new ConflictException('username already exsist');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredential: AuthCredentialDto) {
        const { username, password } = authCredential;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        }

        return null;
    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}
