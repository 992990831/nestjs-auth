import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('/')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  //登录获取JWT
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  //通过JWT访问受保护的接口
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(JSON.stringify(req.user));
    return req.user;
  }

  //登录获取SessionID
  @UseGuards(AuthGuard('useSession'))
  @Post('auth/login2')
  async login2(@Request() req) {
    return true;
  }

  //通过Session访问受保护的接口
  @UseGuards(AuthGuard('applySession'))
  @Get('profile2')
  getProfile2(@Request() req) {
    console.log(JSON.stringify(req.user));
    return req.user;
  }
}