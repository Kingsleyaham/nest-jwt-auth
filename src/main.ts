import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import corsOptions from './config/cors.config';
import swaggerConfig, { swaggerOptions } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger api documentation setup
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );
  SwaggerModule.setup('api/v1/doc', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.use(helmet());
  app.enableCors(corsOptions);
  app.use(compression());
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}
bootstrap();
