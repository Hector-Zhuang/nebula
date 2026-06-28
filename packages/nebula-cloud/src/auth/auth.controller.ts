import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }

  @Post('login')
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @Post('forgot-password')
  forgotPassword(@Body() input: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(input.email);
  }

  @Post('reset-password')
  resetPassword(@Body() input: ResetPasswordDto) {
    return this.authService.resetPassword(input.token, input.password);
  }

  @Post('cli/sessions')
  createCliSession() {
    return this.authService.createCliAuthSession();
  }

  @Get('cli/sessions/:code')
  getCliSession(@Param('code') code: string) {
    return this.authService.getCliAuthSessionStatus(code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cli/sessions/:code/approve')
  approveCliSession(@Param('code') code: string, @Req() req: { user: any }) {
    return this.authService.approveCliAuthSession(code, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: unknown }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Req() req: { user: any }, @Body() input: UpdateProfileDto) {
    return this.authService.updateProfile(req.user, input);
  }
}
