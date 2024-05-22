import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id do usuário é obrigatorio' })
  id_usuario: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Id do projeto é obrigatorio' })
  id_projeto: number;

  @IsString()
  @IsNotEmpty({ message: 'Texto é obrigatorio' })
  text_comentario: string;
}
