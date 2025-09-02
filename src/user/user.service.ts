import { Injectable } from '@nestjs/common';
import { editUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async edituser(userId: number, dto: editUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });
    delete (user as any).password;
    return user;
  }
}
