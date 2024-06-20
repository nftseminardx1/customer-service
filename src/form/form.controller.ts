// form/form.controller.ts
import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    const username = req.user?.username; // ?を追加して安全にアクセス
    return this.formService.getProfile(username);
  }
}
