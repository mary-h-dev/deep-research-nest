
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateQuestionsDto {
  @ApiProperty({ example: 'آیا درمان قطعی برای دیابت وجود دارد؟' })
  @IsString()
  query: string;
}
