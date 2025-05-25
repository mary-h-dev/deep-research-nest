
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsObject } from 'class-validator'

export class CreateAiDeepSearchDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string
  @ApiPropertyOptional() @IsOptional() @IsString() subject?: string
  @ApiPropertyOptional() @IsOptional() @IsString() finalResult?: string
  @ApiPropertyOptional() @IsOptional() @IsObject() rawResult?: any
  @ApiPropertyOptional() @IsOptional() @IsObject() deepSearchContext?: any
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: any
}





// model AiDeepSearch {
//     id                 String   @id @default(uuid())
//     name               String?  
//     description        String?  
//     subject            String?  
//     finalResult        String?  
//     rawResult          Json?    
//     deepSearchContext  Json?    
//     metadata           Json?    
//     userId             String?  
//     createdAt          DateTime @default(now())
//     updatedAt          DateTime @updatedAt
//   }
  
