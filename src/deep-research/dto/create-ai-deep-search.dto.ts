
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateAiDeepSearchDto {

  @ApiProperty({ description: 'The user’s main research query', example: 'Is there a definitive cure for diabetes?' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ description: 'User’s answers to follow-up questions', type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  answers?: string[];

  @ApiPropertyOptional({ description: 'Override research depth (1–5)', example: 3, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  depth?: number;

  @ApiPropertyOptional({ description: 'Override research breadth (2–10)', example: 3, minimum: 2, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(10)
  breadth?: number;
}
