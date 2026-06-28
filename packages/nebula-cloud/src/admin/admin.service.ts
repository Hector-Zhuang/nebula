import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type CurrentUser = {
  id: string;
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        notes: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const auditLogs = await this.prisma.auditLog.findMany({
      where: { targetType: 'user' },
      orderBy: { createdAt: 'desc' },
      take: 40,
      include: {
        actor: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    return { users, auditLogs };
  }

  async createUser(currentUser: CurrentUser, input: CreateUserDto) {
    const email = input.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        displayName: input.displayName,
        passwordHash: await bcrypt.hash(input.password, 10),
        status: input.status ?? UserStatus.ACTIVE,
        notes: input.notes,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        notes: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.logAudit(
      currentUser.id,
      'user',
      user.id,
      'create',
      `Created dashboard member ${user.email}`,
      {},
    );

    return user;
  }

  async updateUser(
    currentUser: CurrentUser,
    userId: string,
    input: UpdateUserDto,
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const data: Record<string, unknown> = {};
    if (input.email !== undefined) data.email = input.email.toLowerCase();
    if (input.displayName !== undefined) data.displayName = input.displayName;
    if (input.status !== undefined) data.status = input.status;
    if (input.notes !== undefined) data.notes = input.notes;
    if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl;
    if (input.password !== undefined) {
      data.passwordHash = await bcrypt.hash(input.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        notes: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.logAudit(
      currentUser.id,
      'user',
      user.id,
      'update',
      `Updated dashboard member ${user.email}`,
      {
        fields: Object.keys(data),
      },
    );

    return user;
  }

  private async logAudit(
    actorId: string,
    targetType: string,
    targetId: string,
    action: string,
    summary: string,
    metadataJson?: Record<string, unknown>,
  ) {
    await this.prisma.auditLog.create({
      data: {
        actorId,
        targetType,
        targetId,
        action,
        summary,
        metadataJson: metadataJson as any,
      },
    });
  }
}
