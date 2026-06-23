import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { RABBITMQ_QUEUE } from './common/messaging/rabbitmq-client.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,

    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],

    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  });
  app.use(cookieParser());
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [
        process.env.RABBITMQ_URL ?? 'amqp://teamboard:teamboard@localhost:5672',
      ],
      queue: process.env.RABBITMQ_QUEUE ?? RABBITMQ_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce(
          (accumulator, error) => {
            accumulator[error.property] = Object.values(
              error.constraints ?? {},
            ).join(', ');
            return accumulator;
          },
          {} as Record<string, string>,
        ); // ensure proper typing

        throw new BadRequestException(formattedErrors);
      },
    }),
  );
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
