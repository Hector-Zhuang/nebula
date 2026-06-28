import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(input: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        displayName: input.displayName,
        passwordHash: await bcrypt.hash(input.password, 10),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        notes: true,
        avatarUrl: true,
        lastLoginAt: true,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(input: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.status === 'DISABLED') {
      throw new UnauthorizedException('User account is disabled');
    }
    const matched = await bcrypt.compare(input.password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const lastLoginAt = new Date();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt },
    });

    return this.buildAuthResponse({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      status: user.status,
      notes: user.notes,
      avatarUrl: user.avatarUrl,
      lastLoginAt,
    });
  }

  async createCliAuthSession() {
    const code = this.generateCliAuthCode();
    const session = await this.prisma.cliAuthSession.create({
      data: {
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      select: {
        code: true,
        expiresAt: true,
      },
    });

    const authWebBaseUrl = this.getAuthWebBaseUrl();
    return {
      code: session.code,
      verificationUrl: `${authWebBaseUrl}/cli-auth/${session.code}`,
      expiresAt: session.expiresAt,
      intervalSeconds: 2,
    };
  }

  async getCliAuthSessionStatus(code: string) {
    const session = await this.prisma.cliAuthSession.findUnique({
      where: { code },
      include: {
        approvedBy: {
          select: {
            id: true,
            email: true,
            displayName: true,
            status: true,
            notes: true,
            avatarUrl: true,
            lastLoginAt: true,
          },
        },
      },
    });
    if (!session) {
      throw new NotFoundException('CLI auth session not found');
    }
    if (session.expiresAt.getTime() <= Date.now()) {
      return {
        status: 'expired' as const,
      };
    }
    if (!session.accessToken || !session.approvedBy) {
      return {
        status: 'pending' as const,
      };
    }

    return {
      status: 'approved' as const,
      accessToken: session.accessToken,
      user: session.approvedBy,
    };
  }

  async approveCliAuthSession(
    code: string,
    user: {
      id: string;
      email: string;
      displayName: string;
      status?: string;
      notes?: string | null;
      lastLoginAt?: Date | null;
    },
  ) {
    const session = await this.prisma.cliAuthSession.findUnique({
      where: { code },
    });
    if (!session) {
      throw new NotFoundException('CLI auth session not found');
    }
    if (session.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('CLI auth session has expired');
    }

    const auth = await this.buildAuthResponse(user);
    await this.prisma.cliAuthSession.update({
      where: { code },
      data: {
        approvedById: user.id,
        accessToken: auth.accessToken,
        approvedAt: new Date(),
      },
    });

    return {
      success: true,
      user,
    };
  }

  async requestPasswordReset(email: string): Promise<{ success: true }> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      // Invalidate existing unused tokens for this user
      await this.prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      });

      const token = crypto.randomBytes(32).toString('hex');
      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
      });

      const consoleBaseUrl = (
        process.env.CONSOLE_BASE_URL || 'http://localhost:5173'
      ).replace(/\/$/, '');
      const resetUrl = `${consoleBaseUrl}/reset-password/${token}`;

      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.displayName,
        resetUrl,
      );
    }

    // Always return success to prevent email enumeration
    return { success: true };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ success: true }> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    if (resetToken.usedAt) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    if (resetToken.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('Reset token has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { success: true };
  }

  async updateProfile(user: { id: string }, input: UpdateProfileDto) {
    const data: Record<string, unknown> = {};
    if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl;

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        notes: true,
        avatarUrl: true,
        lastLoginAt: true,
      },
    });

    return updated;
  }

  private async buildAuthResponse(user: {
    id: string;
    email: string;
    displayName: string;
    status?: string;
    notes?: string | null;
    avatarUrl?: string | null;
    lastLoginAt?: Date | null;
  }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken,
      user,
    };
  }

  private generateCliAuthCode() {
    return `cli_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  }

  private getAuthWebBaseUrl() {
    return (
      process.env.PUBLIC_REVIEW_WEB_BASE_URL || 'http://localhost:5173'
    ).replace(/\/$/, '');
  }
}
