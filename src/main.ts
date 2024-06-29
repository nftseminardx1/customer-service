import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API First Service')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth() // JWT認証のための設定を追加
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [AppModule],
  });
  SwaggerModule.setup('api', app, document);

  // CORS設定を追加
  app.enableCors({
    origin: '*', // 全てのオリジンを許可（必要に応じて特定のオリジンに変更）
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  await app.listen(3000);
}
bootstrap();
