import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('/signup')
    async signUp(@Body(ValidationPipe) authCredential: AuthCredentialDto) {
        await this.authService.signUp(authCredential);
        return {
            message: 'signup success',
        };
    }
}
