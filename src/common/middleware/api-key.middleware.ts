import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('Invalid or missing API Key');
    }

    next();
  }
}
