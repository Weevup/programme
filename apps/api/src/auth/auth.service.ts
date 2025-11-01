import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginInput, RegisterInput, User } from '@event-platform/types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
    };
  }

  async register(registerInput: RegisterInput) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerInput.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerInput.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerInput.email,
        name: registerInput.name,
        password: hashedPassword,
        role: registerInput.role,
      },
    });

    const { password: _, ...result } = user;

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: result,
      accessToken,
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    const { password: _, ...result } = user;
    return result as User;
  }
}
