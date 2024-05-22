import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.comentario.create({ data });
  }

  async findAll() {
    return await this.prisma.comentario.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findDeletados() {
    return await this.prisma.comentario.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.comentario.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.comentario.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
