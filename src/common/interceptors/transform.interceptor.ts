import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ||
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getClass()) ||
      'Success';

    return next.handle().pipe(
      map((result) => {
        new Logger('Traffic').log(`${request.method} ${request.url} - Success`);

        const isPaginated = result && result.meta && result.data;

        return {
          message,
          data: isPaginated
            ? {
                contents: result.data,
                pagination: result.meta,
              }
            : result,
        };
      }),
    );
  }
}
