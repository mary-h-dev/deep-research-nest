import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateQuestionsDto {
  @ApiProperty({ example: 'Is there a definitive cure for type 2 diabetes?' })
  @IsString()
  query: string;
}
