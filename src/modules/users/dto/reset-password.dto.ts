import { IsString, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  senha: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  confirmeSenha: string;
}
