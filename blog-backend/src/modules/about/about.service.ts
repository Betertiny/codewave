import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  async find() {
    let about = await this.prisma.about.findFirst();

    // 如果不存在，则创建一个默认的
    if (!about) {
      about = await this.prisma.about.create({
        data: {
          title: '关于我',
          content: '# 关于\n\n欢迎来到我的博客！',
          socialLinks: [],
        },
      });
    }

    return about;
  }

  async update(updateAboutDto: UpdateAboutDto) {
    const about = await this.prisma.about.findFirst();

    if (!about) {
      // 创建
      return this.prisma.about.create({
        data: {
          ...updateAboutDto,
          title: updateAboutDto.title || '关于我',
          content: updateAboutDto.content || '',
        },
      });
    }

    // 更新
    return this.prisma.about.update({
      where: { id: about.id },
      data: updateAboutDto,
    });
  }
}
