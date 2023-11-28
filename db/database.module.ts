import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        synchronize: false,
        migrationsRun: true,
        autoLoadEntities: true,
        migrations: [join(__dirname, './../db/migrations/{.ts,*.js}')],
        entities: [join(__dirname, './../**/*.entity.js')],
        cli: {
          migrationsDir: 'db/migrations',
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
