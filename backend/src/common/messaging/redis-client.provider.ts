import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisClientProvider = {
  provide: REDIS_CLIENT,
  useFactory: () =>
    ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),
};
