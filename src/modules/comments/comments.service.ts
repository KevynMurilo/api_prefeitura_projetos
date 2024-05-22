import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../users/users.repository';
import { ProjectsRepository } from '../projects/projects.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly projectRepository: ProjectsRepository,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { id_usuario, id_projeto, text_comentario } = createCommentDto;

    const user = await this.usersRepository.findUserById(id_usuario);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const project = await this.projectRepository.findOne(id_projeto);
    if (!project) throw new NotFoundException('Projeto não encontrado');

    const createComment = await this.commentsRepository.create({
      id_usuario,
      id_projeto,
      text_comentario,
    });

    return createComment;
  }

  async findAll() {
    const comments = await this.commentsRepository.findAll();

    if (comments.length === 0) {
      throw new NotFoundException('Nenhum comentario encontrado');
    }

    return comments;
  }

  async findDeletados() {
    const comments = await this.commentsRepository.findDeletados();

    if (comments.length === 0) {
      throw new NotFoundException('Nenhum comentario encontrado');
    }

    return comments;
  }

  async findOne(id: number) {
    const comment = await this.commentsRepository.findOne(id);

    if (!comment) throw new NotFoundException('Nenhum comentario encontrado');

    return comment;
  }

  async remove(id: number) {
    const comment = await this.commentsRepository.findOne(id);

    if (!comment) throw new NotFoundException('Nenhum comentario encontrado');

    await this.commentsRepository.remove(id);

    return { message: 'Comentario deletado com sucesso!' };
  }
}
