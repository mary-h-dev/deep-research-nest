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

export class RunResearchDto {
  @ApiProperty({ example: 'Is there a definitive cure for type 2 diabetes?' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ example: 3, description: 'Override research depth (1–5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  depth?: number;

  @ApiPropertyOptional({ example: 3, description: 'Override research breadth (2–10)', minimum: 2, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(10)
  breadth?: number;

  @ApiPropertyOptional({
    type: [String],
    example: [
      'I want to write an article on new treatments for type 2 diabetes.',
      'I’d like to know if combining new drugs with dietary changes is effective.',
    ],
    description: 'User’s detailed answers to follow-up questions',
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  answers?: string[];
}
