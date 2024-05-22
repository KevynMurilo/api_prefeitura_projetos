import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './database/prisma.service';
import { PrismaModule } from './database/prisma.module';
import { EmailModule } from './modules/email/email.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [UsersModule, PrismaModule, EmailModule, ProjectsModule, CommentsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
