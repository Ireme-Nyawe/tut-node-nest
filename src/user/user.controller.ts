import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { editUserDto } from './dto';
import { UserService } from './user.service';
import type { User } from 'generated/prisma';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  GetMe(@GetUser() user: User, @GetUser('email') email: string) {
    console.log(email);

    return user;
  }
  @Patch()
  editUser(@GetUser("id") id: number, @Body() dto: editUserDto) {    
    return this.userService.edituser(id, dto);
  }
}
