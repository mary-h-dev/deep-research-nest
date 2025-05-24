import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { DeepResearchModule } from './deep-research/deep-research.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostsModule,
    DeepResearchModule,
  ],
})
export class AppModule {}


