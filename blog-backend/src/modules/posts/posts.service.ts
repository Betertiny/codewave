import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, QueryPostDto } from './dto';
import { PaginatedPosts } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<any> {
    // 检查 slug 是否已存在
    const existing = await this.prisma.post.findUnique({
      where: { slug: createPostDto.slug },
    });
    if (existing) {
      throw new ConflictException('该 slug 已存在');
    }

    const { tagIds, categoryId, ...postData } = createPostDto;

    const post = await this.prisma.post.create({
      data: {
        ...postData,
        category: categoryId
          ? {
              connect: { id: categoryId },
            }
          : undefined,
        tags: tagIds?.length
          ? {
              create: tagIds.map((tagId) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.formatPost(post);
  }

  async findAll(query: QueryPostDto): Promise<PaginatedPosts> {
    const { page = 1, pageSize = 10, tag, category } = query;
    const skip = (page - 1) * pageSize;

    const where: any = {
      published: true,
      deletedAt: null, // 只返回未删除的文章
    };

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
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
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts.map((p) => this.formatPost(p)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(slug: string): Promise<any> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post || post.deletedAt) {
      throw new NotFoundException('文章不存在');
    }

    // 检查定时发布
    if (!post.published && post.scheduledAt) {
      if (new Date() >= post.scheduledAt) {
        // 自动发布
        await this.prisma.post.update({
          where: { id: post.id },
          data: { published: true, scheduledAt: null },
        });
        post.published = true;
        post.scheduledAt = null;
      }
    }

    // 增加浏览量
    await this.prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return this.formatPost(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<any> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    const { tagIds, categoryId, ...postData } = updatePostDto;

    // 更新标签
    if (tagIds !== undefined) {
      await this.prisma.postTag.deleteMany({ where: { postId: id } });
    }

    const updated = await this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        category: categoryId !== undefined
          ? categoryId === null
            ? { disconnect: true }
            : { connect: { id: categoryId } }
          : undefined,
        tags:
          tagIds?.length
            ? {
                create: tagIds.map((tagId) => ({
                  tag: {
                    connect: { id: tagId },
                  },
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.formatPost(updated);
  }

  /**
   * 软删除文章
   */
  async softDelete(id: number): Promise<void> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    await this.prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * 恢复已删除的文章
   */
  async restore(id: number): Promise<any> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    const restored = await this.prisma.post.update({
      where: { id },
      data: { deletedAt: null },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.formatPost(restored);
  }

  /**
   * 彻底删除文章
   */
  async remove(id: number): Promise<void> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    await this.prisma.post.delete({ where: { id } });
  }

  /**
   * 获取回收站文章列表
   */
  async findDeleted(): Promise<any[]> {
    const posts = await this.prisma.post.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return posts.map((p) => this.formatPost(p));
  }

  /**
   * 清空回收站
   */
  async clearRecycleBin(): Promise<{ count: number }> {
    const result = await this.prisma.post.deleteMany({
      where: { deletedAt: { not: null } },
    });

    return { count: result.count };
  }

  /**
   * 获取统计数据（用于仪表盘）
   */
  async getStats(): Promise<any> {
    const [
      totalPosts,
      publishedPosts,
      totalViews,
      deletedPosts
    ] = await Promise.all([
      this.prisma.post.count({ where: { deletedAt: null } }),
      this.prisma.post.count({ where: { published: true, deletedAt: null } }),
      this.prisma.post.aggregate({
        where: { deletedAt: null },
        _sum: { viewCount: true },
      }),
      this.prisma.post.count({ where: { deletedAt: { not: null } } }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalViews: totalViews._sum.viewCount || 0,
      deletedPosts,
    };
  }

  private formatPost(post: any) {
    return {
      ...post,
      category: post.category || null,
      tags: post.tags?.map((pt: any) => pt.tag) || [],
    };
  }
}
