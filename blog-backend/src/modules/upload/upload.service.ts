import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    const uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const filepath = path.join(uploadDir, filename);

    // 保存文件
    fs.writeFileSync(filepath, file.buffer);

    // 生成 URL
    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3001';
    const url = `${baseUrl}/uploads/${filename}`;

    // 保存到数据库
    const fileRecord = await this.prisma.file.create({
      data: {
        filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url,
      },
    });

    return {
      id: fileRecord.id,
      url: fileRecord.url,
      filename: fileRecord.filename,
      originalname: fileRecord.originalname,
      size: fileRecord.size,
      mimetype: fileRecord.mimetype,
    };
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    const result = await this.uploadFile(file);
    return { url: result.url };
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (file) {
      const uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
      const filepath = path.join(uploadDir, file.filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      await this.prisma.file.delete({ where: { id } });
    }
  }
}
