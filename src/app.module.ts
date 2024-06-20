// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FormModule } from './form/form.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, FormModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
