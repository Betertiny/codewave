import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// 允许的文件扩展名白名单
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
// 允许的 MIME 类型白名单
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];
// SVG 恶意模式检测
const SVG_DANGEROUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /data:/i,
  /import\s/i,
  /expression\s*\(/i,
  /behavior\s*:/i,
  /xlink:href/i,
];

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

  /**
   * 验证文件扩展名
   */
  private validateExtension(filename: string): void {
    const ext = path.extname(filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(
        `不支持的文件类型。允许的类型: ${ALLOWED_EXTENSIONS.join(', ')}`
      );
    }
  }

  /**
   * 验证 MIME 类型
   */
  private validateMimeType(mimetype: string): void {
    if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
      throw new BadRequestException(
        `不允许的文件 MIME 类型: ${mimetype}`
      );
    }
  }

  /**
   * 防止路径遍历攻击
   */
  private sanitizeFilename(filename: string): string {
    // 移除所有路径分隔符和双点
    const sanitized = filename
      .replace(/\.\./g, '')
      .replace(/[/\\]/g, '')
      .replace(/\0/g, '');
    
    // 确保文件名不包含危险字符
    if (sanitized.match(/[<>:"|?*]/)) {
      throw new BadRequestException('文件名包含非法字符');
    }
    
    return sanitized;
  }

  /**
   * SVG 文件安全检查
   */
  private validateSvgContent(buffer: Buffer): void {
    const content = buffer.toString('utf-8');
    
    // 检查是否包含恶意模式
    for (const pattern of SVG_DANGEROUS_PATTERNS) {
      if (pattern.test(content)) {
        throw new ForbiddenException('SVG 文件包含潜在危险的代码');
      }
    }
  }

  /**
   * 生成安全的文件名
   */
  private generateSecureFilename(originalname: string): string {
    const ext = path.extname(originalname).toLowerCase();
    return `${uuidv4()}${ext}`;
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    // 验证扩展名
    this.validateExtension(file.originalname);
    
    // 验证 MIME 类型
    this.validateMimeType(file.mimetype);
    
    // 验证路径遍历
    this.sanitizeFilename(file.originalname);
    
    // SVG 文件内容安全检查
    if (file.mimetype === 'image/svg+xml') {
      this.validateSvgContent(file.buffer);
    }

    const uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    const filename = this.generateSecureFilename(file.originalname);
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
      
      // 防止路径遍历
      const absoluteUploadDir = path.resolve(uploadDir);
      const absoluteFilepath = path.resolve(filepath);
      
      if (!absoluteFilepath.startsWith(absoluteUploadDir)) {
        throw new BadRequestException('无效的文件路径');
      }
      
      if (fs.existsSync(absoluteFilepath)) {
        fs.unlinkSync(absoluteFilepath);
      }
      await this.prisma.file.delete({ where: { id } });
    }
  }
}
