import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Serve static files (uploads)
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Security
  app.use(helmet());

  // CORS Configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Kyndex API')
    .setDescription('Skills Exchange Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3001', 'Development')
    .addServer('https://api.kyndex.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 Application running on http://localhost:${port}`);
  logger.log(`📚 API documentation available at http://localhost:${port}/api-docs`);
}

bootstrap();
