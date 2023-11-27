import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as logger from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Riot Games API Integration')
    .setDescription('Riot Games API Integration')
    .setVersion('1.0.0')
    .addTag('Riot Games API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(logger('[:date[iso]] :method :url :status :response-time ms'));

  await app.listen(3000);
}
bootstrap();
