import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { AiDeepSearchService } from './ai-deep-search.service'
import { CreateAiDeepSearchDto } from './dto/create-ai-deep-search.dto'
import { UpdateAiDeepSearchDto } from './dto/update-ai-deep-search.dto'

@ApiTags('AI Deep Search')
@Controller('api/ai-deep-search')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AiDeepSearchController {
  constructor(private readonly svc: AiDeepSearchService) {}

  @Post()
  @ApiOperation({ summary: 'Start deep research and save outputs' })
  create(@Req() req, @Body() dto: CreateAiDeepSearchDto) {
    return this.svc.create(dto, req.user.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one record by id' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id)
  }

  @Get()
  @ApiOperation({ summary: 'List deep-search records (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, type: Number, example: 10 })
  findAll(@Query('page') page = '1', @Query('perPage') perPage = '10') {
    return this.svc.findAll(+page, +perPage)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a record' })
  update(@Param('id') id: string, @Body() dto: UpdateAiDeepSearchDto) {
    return this.svc.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a record' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id)
  }
}
