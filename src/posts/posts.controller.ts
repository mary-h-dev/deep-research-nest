import {
    Controller,
    Get,
    Post as HttpPost,
    Body,
    Param,
    Delete,
  } from '@nestjs/common';
  import { PostsService } from './posts.service';
  import { ApiTags, ApiBody } from '@nestjs/swagger';
  import { CreatePostDto } from './dto/create-post.dto';
  
  
  @ApiTags('Posts')
  @Controller('posts')
  export class PostsController {
    constructor(private readonly postsService: PostsService) {}
  
    @Get()
    findAll() {
      return this.postsService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.postsService.findOne(+id);
    }
  
    @HttpPost()
    @ApiBody({ type: CreatePostDto }) // ⬅️ اضافه‌شده برای Swagger
    create(@Body() createPostDto: CreatePostDto) {
      return this.postsService.create(
        createPostDto.title,
        createPostDto.content,
      );
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.postsService.delete(+id);
    }
  }
  