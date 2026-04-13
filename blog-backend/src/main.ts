import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局前缀
  app.setGlobalPrefix('api');

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('博客 API')
    .setDescription('个人博客后端 API 文档')
    .setVersion('1.0')
    .addTag('posts', '文章相关接口')
    .addTag('tags', '标签相关接口')
    .addTag('about', '关于页面接口')
    .addTag('upload', '文件上传接口')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Blog API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();
