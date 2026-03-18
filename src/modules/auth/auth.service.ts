import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { randomInt, createHash } from 'crypto';
import { PasswordUtil } from 'src/common/utils';

type OtpRecord = { hash: string; expiresAt: number; attempts: number };

@Injectable()
export class AuthService {
  private store = new Map<string, OtpRecord>();

  private hash(code: string) {
    return createHash('sha256').update(code).digest('hex');
  }

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = PasswordUtil.hashPassword(dto.password);

    const newUser = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (!user || !PasswordUtil.verifyPassword(dto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        subscriptionStatus: user.subscription,
        apiKey: user.apiKey,
      },
    };
  }

  generateOtp(email: string) {
    const code = String(randomInt(100000, 1000000));
    const ttl = Number(process.env.OTP_TTL_SECONDS ?? 300) * 1000;

    this.store.set(email, {
      hash: this.hash(code),
      expiresAt: Date.now() + ttl,
      attempts: 0,
    });

    return code;
  }

  verifyOtp(email: string, code: string) {
    const rec = this.store.get(email);
    if (!rec) return false;
    if (Date.now() > rec.expiresAt) return false;

    rec.attempts += 1;
    if (rec.attempts > 5) return false;

    const ok = rec.hash === this.hash(code);
    if (ok) this.store.delete(email);
    return ok;
  }
}
