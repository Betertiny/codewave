import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, QueryCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingByName = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });
    if (existingByName) {
      throw new ConflictException('该分类名称已存在');
    }

    const existingBySlug = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });
    if (existingBySlug) {
      throw new ConflictException('该分类 slug 已存在');
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });
    return category;
  }

  async findAll(query: QueryCategoryDto) {
    const { page = 1, pageSize = 50 } = query;
    const skip = (page - 1) * pageSize;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.category.count(),
    ]);

    const formattedCategories = categories.map((cat) => ({
      ...cat,
      count: cat._count.posts,
      _count: undefined,
    }));

    return {
      data: formattedCategories,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return {
      ...category,
      count: category._count.posts,
      _count: undefined,
    };
  }

  async findBySlugWithPosts(slug: string, page = 1, pageSize = 10) {
    const category = await this.findOne(slug);
    const skip = (page - 1) * pageSize;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          published: true,
          category: {
            slug,
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
      }),
      this.prisma.post.count({
        where: {
          published: true,
          category: {
            slug,
          },
        },
      }),
    ]);

    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((pt) => pt.tag),
      category: undefined,
    }));

    return {
      category,
      posts: formattedPosts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return updated;
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    // 将该分类的文章移出分类
    await this.prisma.post.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await this.prisma.category.delete({ where: { id } });
    return { message: '分类删除成功' };
  }
}
