import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { DeepResearchModule } from './deep-research/deep-research.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          log: ['query', 'info', 'warn', 'error'],
        },
      },
    }),

    DeepResearchModule,
  ],
})
export class AppModule {}
