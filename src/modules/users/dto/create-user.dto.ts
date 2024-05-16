import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @Length(3, undefined, { message: 'Nome deve ter no mínimo  3 caracteres' })
  nome_completo: string;

  @IsEmail(
    {
      allow_display_name: false,
      allow_utf8_local_part: true,
      require_tld: true,
      ignore_max_length: false,
      allow_ip_domain: false,
      domain_specific_validation: false,
    },
    { message: 'Por favor, insira um endereço de e-mail válido' },
  )
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @IsPhoneNumber('BR', { message: 'Telefone inválido' })
  telefone: string;

  @IsNotEmpty({ message: 'Senha é obrigatório' })
  @Length(5, undefined, { message: 'Senha deve ter no mínimo  5 caracteres' })
  senha: string;

  @IsNotEmpty({ message: 'Confirme sua senha é obrigatório' })
  confirme_sua_senha: string;
}
