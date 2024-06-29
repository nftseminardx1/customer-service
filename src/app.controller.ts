import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiProperty,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

// Swagger用のレスポンスDTOを定義
class UserInfoDto {
  @ApiProperty({ example: 21, description: 'The age of the user' })
  age: number;
}

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get Hello World' })
  @ApiResponse({ status: 200, description: 'Returns Hello World' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('info')
  @ApiOperation({
    summary: 'Get sample profile',
    description:
      'このエンドポイントは、JWT トークンに基づいてユーザー情報を取得します。usernameは JWT ペイロードから抽出され、データベースからユーザーの詳細を取得します。',
  })
  @ApiBearerAuth() // JWT認証を使用することを明示
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'Returns user profile information',
    type: UserInfoDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req): Promise<UserInfoDto> {
    console.log('GET', req.user);
    const username = req.user?.username;
    return this.appService.getInformation(username);
  }
}
