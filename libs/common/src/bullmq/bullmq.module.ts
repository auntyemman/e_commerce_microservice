import { Module, DynamicModule } from '@nestjs/common';
import { BullModule, BullRootModuleOptions, getQueueToken } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

@Module({})
export class BullMQModule {
  static register(queueName: string): DynamicModule {
    return {
      module: BullMQModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './libs/common/.env',
        }),
        // BullModule.forRoot({
        //   redis: {
        //     host: process.env.REDIS_HOST || 'localhost',
        //     port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        //   },
        // }),
        // BullModule.registerQueueAsync({
        //   name: queueName,
        //   useFactory: (configService: ConfigService): BullModuleOptions => ({
        //     return new Queue(queueName, {
        //       connection: {
        //         host: configService.get<string>('REDIS_HOST') || 'localhost',
        //         port: configService.get<number>('REDIS_PORT') || 6379,
        //       }),
        //     }),
        //   inject: [ConfigService],
        // },
      ],
      // providers: [
      //   {
      //     provide: getQueueToken(queueName), // Directly map the token
      //     useFactory: () => getQueueToken(queueName),
      //   },
      // ],
      providers: [
        {
          provide: getQueueToken(queueName),
          useFactory: (configService: ConfigService) => {
            return new Queue(queueName, {
              connection: {
                host: configService.get<string>('REDIS_HOST') || 'localhost',
                port: configService.get<number>('REDIS_PORT') || 6379,
              },
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: [getQueueToken(queueName)],
    };
  }
}
