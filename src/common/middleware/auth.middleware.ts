import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userContext } from '../interceptors/user.context';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: any, res: any, next: () => void) {
    const token = this.extractTokenFromHeader(req);
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);

        req.user = payload;

        return userContext.run(payload.sub ?? payload.id, () => next());
      } catch {
        throw new UnauthorizedException('Invalid token');
      }
    }

    return next();
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const auth = request.headers.authorization;
    if (!auth) return undefined;

    const [type, token] = auth.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
