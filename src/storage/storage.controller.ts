import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { StorageService } from './storage.service';
import { FileEntityType } from './file-entity-type.enum';
import { Express } from 'express';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger'; // ✅ اضافه کن

@ApiTags('Storage') // برای نمایش در Swagger
@Controller('storage')
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage',
        filename: (_, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data') // ✅ الزامی برای فایل
  @ApiBody({
    description: 'آپلود فایل برای یک موجودیت',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        entityId: {
          type: 'string',
          example: 'example-entity-id',
        },
        entityType: {
          type: 'string',
          example: 'AI_DEEP_SEARCH',
        },
      },
    },
  })
  @ApiOperation({ summary: 'آپلود فایل و ذخیره متادیتا' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('entityId') entityId: string,
    @Body('entityType') entityType: FileEntityType,
  ) {
    const metadata = await this.storage.saveFileMetadata({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      entityId,
      entityType,
    });
    return { file, metadata };
  }
}
