import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'mysql',

    host: config.get<string>('DB_HOST'),
    port: parseInt(config.get<string>('DB_PORT') || '3306'),

    username: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),

    autoLoadEntities: true,

    synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
    logging: config.get<string>('DB_LOGGING') === 'true',

    timezone: 'Z',

    extra: {
      connectionLimit: parseInt(
        config.get<string>('DB_CONNECTION_LIMIT') || '10',
      ),
    },

    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: true,
  }),
};
