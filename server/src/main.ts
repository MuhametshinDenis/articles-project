import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Articles Project',
    }),
  });

  const logger = new Logger(AppModule.name);
  const configuration = app.get(ConfigService);
  const port = configuration.getOrThrow<number>('application.port');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const documentBuilder = new DocumentBuilder()
    .setTitle('Articles Project API')
    .setDescription('The articles project API description')
    .setVersion('1.0')
    .addTag('articles')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
