import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { userContext } from '../interceptors/user.context';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      const userId = user.sub ?? user.id;
      // This wraps the entire remaining request lifecycle in the context
      return userContext.run(userId, () => next.handle());
    }

    return next.handle();
  }
}
