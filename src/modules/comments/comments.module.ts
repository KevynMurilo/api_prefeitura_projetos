import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersRepository } from '../users/users.repository';
import { ProjectsRepository } from '../projects/projects.repository';
import { CommentsRepository } from './comments.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    UsersRepository,
    ProjectsRepository,
  ],
})
export class CommentsModule {}
