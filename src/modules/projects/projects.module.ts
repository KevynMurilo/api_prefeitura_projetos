import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersRepository } from '../users/users.repository';
import { ProjectsRepository } from './projects.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository, UsersRepository],
})
export class ProjectsModule {}
