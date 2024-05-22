import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'Id do usuário é obrigatório' })
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty({ message: 'Nome do projeto é obrigatório' })
  nome_projeto: string;

  @IsNotEmpty({ message: 'Descrição do projeto é obrigatório' })
  descricao: string;
}
