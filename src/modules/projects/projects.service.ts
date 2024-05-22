import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsRepository } from './projects.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { id_usuario, nome_projeto, descricao } = createProjectDto;

    const usersExists = await this.usersRepository.findUserById(id_usuario);
    if (!usersExists) throw new NotFoundException('Usuário não encontrado');

    const createProject = await this.projectsRepository.create({
      id_usuario,
      nome_projeto,
      descricao,
    });

    return createProject;
  }

  async findAll() {
    const project = await this.projectsRepository.findAll();
    if (project.length === 0) {
      throw new NotFoundException('Nenhum projeto registrado');
    }

    return project;
  }

  async findDeletados() {
    const deletados = await this.projectsRepository.findDeletados();
    if (deletados.length === 0) {
      throw new NotFoundException('Nenhum projeto deletado');
    }

    return deletados;
  }

  async findOne(id: number) {
    const project = await this.projectsRepository.findOne(id);
    if (!project) throw new NotFoundException('Nenhum projeto encontrado');

    return project;
  }

  async remove(id: number) {
    const project = await this.projectsRepository.findOne(id);

    if (!project) throw new NotFoundException('Nenhum projeto encontrado');

    await this.projectsRepository.remove(id);

    return { message: `Projeto ${project.nome_projeto} removido com sucesso` };
  }
}
