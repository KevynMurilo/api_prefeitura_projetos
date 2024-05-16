import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(token: string) {
    const decoded: any = this.jwtService.verify(token);
    const createdUser = await this.prisma.usuarios.create({
      data: {
        nome_completo: decoded.nome_completo,
        email: decoded.email,
        telefone: decoded.telefone,
        senha: decoded.senha,
        verificado: true,
      },
      select: {
        id: true,
        nome_completo: true,
        email: true,
        telefone: true,
        status: true,
        verificado: true,
      },
    });

    if (!createdUser) {
      throw new InternalServerErrorException('Erro ao cadastrar usuário');
    }

    return 'E-mail confirmado com sucesso';
  }

  async sendVerificationEmail(createUserDto: CreateUserDto) {
    const emailExists = await this.prisma.usuarios.findUnique({
      where: { email: createUserDto.email },
    });
    if (emailExists) throw new ConflictException('Email já cadastrado');

    const token = this.jwtService.sign({
      nome_completo: createUserDto.nome_completo,
      email: createUserDto.email,
      telefone: createUserDto.telefone,
      senha: createUserDto.senha,
    });

    const verificationLink = `http://localhost:3000/users/confirm-email?token=${token}`;
    await this.emailService.sendVerificationEmail(
      createUserDto.email,
      verificationLink,
    );

    return {
      message:
        'Um e-mail de verificação foi enviado para o seu endereço de e-mail',
    };
  }

  async findAll(): Promise<object[]> {
    const users = await this.prisma.usuarios.findMany();

    if (users.length === 0) {
      throw new NotFoundException('Nenhum usuário cadastrado');
    }

    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.usuarios.findUnique({
      where: { id },
      select: {
        id: true,
        nome_completo: true,
        email: true,
        telefone: true,
        status: true,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: number) {
    const user = await this.prisma.usuarios.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.prisma.usuarios.delete({ where: { id } });

    return 'Usuário deletado com sucesso';
  }
}
