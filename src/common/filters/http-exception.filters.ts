import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpException');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();

    const errorDetails =
      exceptionResponse.errors ||
      exceptionResponse.message ||
      exception.message;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'object' && exceptionResponse.message
          ? exceptionResponse.message
          : 'Validation failed',
      errors: exceptionResponse.errors || null,
    };
    this.logger.error(
      `${request.method} ${request.url} ${status} - Details: ${JSON.stringify(errorDetails)}`,
    );

    response.status(status).json(errorResponse);
  }
}
