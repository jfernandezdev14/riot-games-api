import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Riot Games API Integration')
    .setDescription('Riot Games API Integration')
    .setVersion('1.0.0')
    .addTag('Riot Games API')
    .build();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  const logger = new Logger('Bootstrap');
  app.useLogger(logger);
  logger.log(`Application starting using port ${port}`);
  logger.log('Swagger Documentation available at /docs');
  await app.listen(3000);
}
bootstrap();
