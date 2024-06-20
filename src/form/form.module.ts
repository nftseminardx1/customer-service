// form/form.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { AuthModule } from '../auth/auth.module';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
