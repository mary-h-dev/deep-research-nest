import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('API for managing blog posts')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // مسیر swagger: http://localhost:3000/api

  await app.listen(3000);
}
console.log('🧪 OPENAI_API_KEY):', process.env.OPENAI_API_KEY);
bootstrap();
