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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Post('users')
  createUser(@Req() req: { user: any }, @Body() input: CreateUserDto) {
    return this.adminService.createUser(req.user, input);
  }

  @Patch('users/:userId')
  updateUser(
    @Req() req: { user: any },
    @Param('userId') userId: string,
    @Body() input: UpdateUserDto,
  ) {
    return this.adminService.updateUser(req.user, userId, input);
  }
}
