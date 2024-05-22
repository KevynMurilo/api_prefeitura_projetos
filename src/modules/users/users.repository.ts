import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async createUser(data: any) {
    return this.prisma.usuario.create({
      data,
      select: {
        id: true,
        nome_completo: true,
        email: true,
        telefone: true,
        email_verificado: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async updateUserById(id: number, data: any) {
    return this.prisma.usuario.update({
      where: {
        id,
        deletedAt: null,
      },
      data,
      select: {
        id: true,
        nome_completo: true,
        email: true,
        telefone: true,
        email_verificado: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async updateUserByEmail(email: string, data: any) {
    return this.prisma.usuario.update({
      where: {
        email,
      },
      data,
      select: {
        id: true,
        nome_completo: true,
        email: true,
        telefone: true,
        email_verificado: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async updatePassword(id: number, senha: string) {
    return this.prisma.usuario.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        senha: senha,
      },
    });
  }

  async findAllActiveUsers() {
    return this.prisma.usuario.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        nome_completo: true,
        email: true,
        telefone: true,
        email_verificado: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async findUserById(id: number) {
    return this.prisma.usuario.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        nome_completo: true,
        email: true,
        telefone: true,
        email_verificado: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async findAllDeletedUsers() {
    return this.prisma.usuario.findMany({
      where: {
        deletedAt: { not: null },
      },
      select: {
        id: true,
        nome_completo: true,
        email: true,
        telefone: true,
        email_verificado: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async deleteUserById(id: number) {
    return this.prisma.usuario.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
