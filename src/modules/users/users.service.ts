import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { BcryptUtils } from 'src/common/utils/bcrypt.utils';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, nome_completo, telefone, senha } = createUserDto;
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      if (existingUser.deletedAt) {
        return await this.restoreUser(email, nome_completo, telefone, senha);
      } else {
        throw new ConflictException('Email já cadastrado');
      }
    }

    const hashedPassword = await BcryptUtils.hashPassword(senha);
    const verificationToken = this.jwtService.sign({ email });
    const newUser = await this.usersRepository.createUser({
      nome_completo,
      email,
      telefone,
      senha: hashedPassword,
      email_verificado: false,
    });
    await this.emailService.sendVerificationEmail(email, verificationToken);
    return newUser;
  }

  async verifyEmailUser(token: string) {
    const { email } = this.jwtService.verify(token);
    const user = await this.usersRepository.findByEmail(email);
    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.email_verificado) {
      throw new ConflictException('Usuário já verificado');
    }

    await this.usersRepository.updateUserByEmail(email, {
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

  async sendEmailUpdatePassword(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const resetToken = this.jwtService.sign({ email });
    await this.emailService.sendPasswordResetEmail(email, resetToken);
    return { message: 'Email de recuperação de senha enviado com sucesso' };
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const { email } = this.jwtService.verify(token);
    const user = await this.usersRepository.findByEmail(email);

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { senha, confirmeSenha } = resetPasswordDto;
    if (senha !== confirmeSenha) {
      throw new ConflictException('As senhas não coincidem');
    }

    const hashedPassword = await BcryptUtils.hashPassword(senha);
    await this.usersRepository.updateUserByEmail(email, {
      senha: hashedPassword,
    });
    return { message: 'Senha redefinida com sucesso' };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findUserById(id);

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { email } = updateUserDto;
    if (email && email !== user.email) {
      const existingUserWithEmail =
        await this.usersRepository.findByEmail(email);

      if (existingUserWithEmail) {
        throw new ConflictException('Email já cadastrado');
      }

      const verificationToken = this.jwtService.sign({ email });
      await this.emailService.sendVerificationEmail(email, verificationToken);
    }

    const updateUser = await this.usersRepository.updateUserById(
      id,
      updateUserDto,
    );
    return updateUser;
  }

  async remove(id: number) {
    const user = await this.usersRepository.findUserById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await this.usersRepository.deleteUserById(id);
    return 'Usuário deletado com sucesso';
  }

  private async restoreUser(
    email: string,
    nome_completo: string,
    telefone: string,
    senha: string,
  ) {
    await this.usersRepository.updateUserByEmail(email, {
      nome_completo,
      telefone,
      senha,
      email_verificado: false,
      deletedAt: null,
    });
    const verificationToken = this.jwtService.sign({ email });
    await this.emailService.sendVerificationEmail(email, verificationToken);
    return { message: 'Usuário restaurado com sucesso!' };
  }
}
