// form/form.controller.ts
import { Controller, UseGuards, Request, Get, Put, Body, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    console.log(req.user);
    const username = req.user?.username;
    //return { username: username };
    return this.formService.getProfile(username);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Request() req, @Body() formData) {
    console.log(req.user);
    const username = req.user?.username;
    return this.formService.updateProfile(username, formData);
  }

  @Delete(':username')
  @UseGuards(AuthGuard('jwt'))
  async deleteProfile(@Param('username') username: string) {
    return this.formService.deleteProfile(username);
  }
}
