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
  @ApiProperty({ example: 'آیا درمان قطعی برای دیابت وجود دارد؟' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ example: 3, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  depth?: number;

  @ApiPropertyOptional({ example: 3, minimum: 2, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(10)
  breadth?: number;

  @ApiPropertyOptional({
    type: [String],
    example: [
      'هدفم نوشتن مقاله‌ای در مورد روش‌های درمانی جدید برای دیابت نوع ۲ است.',
      'می‌خوام بدونم ترکیب داروهای جدید با رژیم غذایی موثر هست یا نه.',
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  answers?: string[];
}
