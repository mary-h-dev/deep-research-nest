import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));


  const config = new DocumentBuilder()
    .setTitle('Deep Research Engine')
    .setDescription('Deep Research + AI Deep Search endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  
  SwaggerModule.setup('api/docs', app, document);
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  await app.listen(3000);
  console.log(`Server running on http://localhost:3000`);
  console.log(`Swagger UI on http://localhost:3000/api/docs`);
}
bootstrap();
