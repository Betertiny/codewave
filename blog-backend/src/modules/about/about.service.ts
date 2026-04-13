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
          socialLinks: { github: '', twitter: '', email: '' },
          skills: '[]',
        },
      });
    }

    // 解析技能 JSON
    const result: any = { ...about };
    if (result.skills && typeof result.skills === 'string') {
      try {
        result.skills = JSON.parse(result.skills);
      } catch {
        result.skills = [];
      }
    } else if (!result.skills) {
      result.skills = [];
    }

    return result;
  }

  async update(updateAboutDto: UpdateAboutDto) {
    const about = await this.prisma.about.findFirst();

    // 处理技能数组 - 转换为 JSON 字符串存储
    const data: any = { ...updateAboutDto };
    if (data.skills && Array.isArray(data.skills)) {
      data.skills = JSON.stringify(data.skills);
    }

    if (!about) {
      // 创建
      return this.prisma.about.create({
        data: {
          ...data,
          title: data.title || '关于我',
          content: data.content || '',
          skills: data.skills || '[]',
        },
      });
    }

    // 更新
    return this.prisma.about.update({
      where: { id: about.id },
      data,
    });
  }
}
