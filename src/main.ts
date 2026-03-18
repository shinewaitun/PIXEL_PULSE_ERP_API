import 'reflect-metadata';
import 'dotenv/config';

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { loggerConfig } from './config/logger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filters';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { UserContextInterceptor } from './common/interceptors/user-context.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig,
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: Object.values(error.constraints ?? {})[0],
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errors: result,
        });
      },
    }),
  );

  const reflector = app.get(Reflector);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TransformInterceptor(reflector),
    new UserContextInterceptor(),
  );

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
