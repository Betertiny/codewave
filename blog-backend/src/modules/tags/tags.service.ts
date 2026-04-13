import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto, UpdateTagDto, QueryTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    // 检查 name 是否已存在
    const existingByName = await this.prisma.tag.findUnique({
      where: { name: createTagDto.name },
    });
    if (existingByName) {
      throw new ConflictException('该标签名称已存在');
    }

    // 检查 slug 是否已存在
    const existingBySlug = await this.prisma.tag.findUnique({
      where: { slug: createTagDto.slug },
    });
    if (existingBySlug) {
      throw new ConflictException('该标签 slug 已存在');
    }

    const tag = await this.prisma.tag.create({
      data: createTagDto,
    });
    return tag;
  }

  async findAll(query: QueryTagDto) {
    const { page = 1, pageSize = 50 } = query;
    const skip = (page - 1) * pageSize;

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: { id: 'asc' },
      }),
      this.prisma.tag.count(),
    ]);

    // 格式化返回，包含文章数量
    const formattedTags = tags.map((tag) => ({
      ...tag,
      count: tag._count.posts,
      _count: undefined,
    }));

    return {
      data: formattedTags,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(slug: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    return {
      ...tag,
      count: tag._count.posts,
      _count: undefined,
    };
  }

  async findBySlugWithPosts(slug: string, page = 1, pageSize = 10) {
    const tag = await this.findOne(slug);
    const skip = (page - 1) * pageSize;

    const posts = await this.prisma.post.findMany({
      where: {
        published: true,
        tags: {
          some: {
            tag: {
              slug,
            },
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((pt) => pt.tag),
    }));

    return {
      tag,
      posts: formattedPosts,
      pagination: {
        page,
        pageSize,
        total: tag.count,
        totalPages: Math.ceil(tag.count / pageSize),
      },
    };
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    const updated = await this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
    return updated;
  }

  async remove(id: number) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    await this.prisma.tag.delete({ where: { id } });
    return { message: '标签删除成功' };
  }
}
