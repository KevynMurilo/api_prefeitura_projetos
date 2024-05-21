import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { UsersRepository } from './users.repository';
import { BcryptUtils } from 'src/common/utils/bcrypt.utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    const hashedPassword = await BcryptUtils.hashPassword(createUserDto.senha);

    const verificationToken = this.jwtService.sign({
      email: createUserDto.email,
    });

    if (existingUser) {
      if (existingUser.deletedAt) {
        await this.usersRepository.updateUser(createUserDto.email, {
          nome_completo: createUserDto.nome_completo,
          telefone: createUserDto.telefone,
          senha: hashedPassword,
          email_verificado: false,
          deletedAt: null,
        });

        await this.emailService.sendVerificationEmail(
          createUserDto.email,
          verificationToken,
        );

        return { message: 'Usuário restaurado com sucesso!' };
      } else {
        throw new ConflictException('Email já cadastrado');
      }
    }

    const newUser = await this.usersRepository.createUser({
      nome_completo: createUserDto.nome_completo,
      email: createUserDto.email,
      telefone: createUserDto.telefone,
      senha: hashedPassword,
      email_verificado: false,
    });

    await this.emailService.sendVerificationEmail(
      createUserDto.email,
      verificationToken,
    );

    return newUser;
  }

  async verifyUser(token: string) {
    const decoded = this.jwtService.verify(token);

    const user = await this.usersRepository.findByEmail(decoded.email);

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.email_verificado) {
      throw new ConflictException('Usuário já verificado');
    }

    await this.usersRepository.updateUser(user.email, {
      email_verificado: true,
    });

    return { message: 'Usuário verificado com sucesso!' };
  }

  async findAll(): Promise<object[]> {
    const users = await this.usersRepository.findAllActiveUsers();

    if (users.length === 0) {
      throw new NotFoundException('Nenhum usuário cadastrado');
    }

    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async findAllDeleted() {
    const deletedUsers = await this.usersRepository.findAllDeletedUsers();

    if (deletedUsers.length === 0) {
      throw new NotFoundException('Nenhum usuário deletado');
    }

    return deletedUsers;
  }

  async remove(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.usersRepository.deleteUserById(id);

    return 'Usuário deletado com sucesso';
  }
}
