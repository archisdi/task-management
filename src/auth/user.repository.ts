import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCredential: AuthCredentialDto): Promise<void> {
        try {
            const { username, password } = authCredential;
            const salt = await bcrypt.genSalt();

            const user = new User();

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

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}
