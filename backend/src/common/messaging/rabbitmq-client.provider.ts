import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const RABBITMQ_CLIENT = 'RABBITMQ_CLIENT';
export const RABBITMQ_QUEUE = 'teamboard_events';

export const rabbitMqClientProvider = {
  provide: RABBITMQ_CLIENT,
  useFactory: () =>
    ClientProxyFactory.create({
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
    }),
};
