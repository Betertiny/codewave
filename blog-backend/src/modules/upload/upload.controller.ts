import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }

  @Post('image')
  @ApiOperation({ summary: '上传图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }

  @Get('files')
  @ApiOperation({ summary: '获取文件列表' })
  findAll() {
    return this.uploadService['prisma'].file.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文件' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.uploadService.deleteFile(id);
  }
}
