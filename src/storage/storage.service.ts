import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FileEntityType } from './file-entity-type.enum';

@Injectable()
export class StorageService {
  constructor(private readonly prisma: PrismaService) {}

  async saveFileMetadata(params: {
    originalName: string;
    filename: string;
    path: string;
    entityId?: string;
    entityType: FileEntityType;
  }) {
    return this.prisma.file.create({
      data: {
        originalName: params.originalName,
        filename: params.filename,
        path: params.path,
        entityId: params.entityId,
        entityType: params.entityType,
      },
    });
  }
}
