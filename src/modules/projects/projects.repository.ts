import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.projeto.create({ data });
  }

  async findAll() {
    return await this.prisma.projeto.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findDeletados() {
    return await this.prisma.projeto.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.projeto.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.projeto.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
