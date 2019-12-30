import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('TaskRepository');

    constructor(
        @InjectRepository(UserRepository)
        private userRepo: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredential: AuthCredentialDto) {
        return this.userRepo.createUser(authCredential);
    }

    async signIn(authCredential: AuthCredentialDto) {
        const username = await this.userRepo.validateUserPassword(authCredential);

        if (!username) {
            throw new UnauthorizedException('INVALID_CREDENTIALS');
        }

        const jwtPayload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(jwtPayload);

        this.logger.debug(`generating new JWT token with payload ${JSON.stringify(jwtPayload)}`);

        return {
            accessToken,
        };
    }
}
