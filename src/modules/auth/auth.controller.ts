import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
// import { SendgridService } from 'common/mailer/sendgrid.service';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly sendgrid: SendgridService,
  ) {}

  @Post('register')
  @ResponseMessage('Registration successful.')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ResponseMessage('Login successful.')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('otp/request')
  requestOtp(@Body('email') email: string) {
    const code = this.authService.generateOtp(email);
    // await this.sendgrid.sendOtpEmail(email, code);
    return { code };
  }

  @Post('otp/verify')
  verifyOtp(@Body() body: { email: string; code: string }) {
    const ok = this.authService.verifyOtp(body.email, body.code);
    return { ok };
  }
}
