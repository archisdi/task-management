import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepo: UserRepository,
    ) {}

    async signUp(authCredential: AuthCredentialDto) {
        return this.userRepo.createUser(authCredential);
    }

    async signIn(authCredential: AuthCredentialDto): Promise<string> {
        return this.userRepo.validateUserPassword(authCredential);
    }
}
