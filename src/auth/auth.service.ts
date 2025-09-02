import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    // generate hash pass
    const hash = await argon.hash(dto.password);
    // save user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });
      return await this.signToken(user.id, user.email);
    } catch (error) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    // if no user exception
    if (!user) {
      throw new ForbiddenException('Incorrect creadentials');
    }
    // check password match
    const pwMatch = argon.verify(user.password, dto.password);
    // if no matching expecption
    if (!pwMatch) {
      throw new ForbiddenException('Incorrect creadentials');
    }
    // return user
    return await this.signToken(user.id, user.email);
  }

  async signToken(id: number, email: string) {
    const payload = {
      sub: id,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return { access_token: token };
  }
}
