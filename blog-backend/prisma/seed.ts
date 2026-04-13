import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 创建标签
  const tag1 = await prisma.tag.upsert({
    where: { slug: 'tech' },
    update: {},
    create: { name: '技术', slug: 'tech', color: 'blue' },
  });

  const tag2 = await prisma.tag.upsert({
    where: { slug: 'life' },
    update: {},
    create: { name: '生活', slug: 'life', color: 'green' },
  });

  const tag3 = await prisma.tag.upsert({
    where: { slug: 'note' },
    update: {},
    create: { name: '笔记', slug: 'note', color: 'purple' },
  });

  console.log('Created tags:', [tag1, tag2, tag3]);

  // 创建分类
  const cat1 = await prisma.category.upsert({
    where: { slug: 'frontend' },
    update: {},
    create: { name: '前端开发', slug: 'frontend', icon: 'code', sortOrder: 1 },
  });

  const cat2 = await prisma.category.upsert({
    where: { slug: 'backend' },
    update: {},
    create: { name: '后端开发', slug: 'backend', icon: 'server', sortOrder: 2 },
  });

  console.log('Created categories:', [cat1, cat2]);

  // 创建文章
  const post1 = await prisma.post.upsert({
    where: { slug: 'welcome-to-my-blog' },
    update: {},
    create: {
      title: '欢迎访问我的博客',
      slug: 'welcome-to-my-blog',
      excerpt: '这是一篇介绍博客的示例文章',
      content: '# 欢迎\n\n欢迎来到我的技术博客！\n\n这里分享我的技术学习和日常思考。',
      published: true,
      categoryId: cat1.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: 'react-hooks-guide' },
    update: {},
    create: {
      title: 'React Hooks 完全指南',
      slug: 'react-hooks-guide',
      excerpt: '深入理解 React Hooks 的使用方法和最佳实践',
      content: '# React Hooks 完全指南\n\n## useState\n\nuseState 是最常用的 Hook...\n\n## useEffect\n\nuseEffect 用于处理副作用...\n\n## 最佳实践\n\n1. 保持 Hook 调用顺序\n2. 自定义 Hook 封装逻辑\n3. 合理使用 useMemo 和 useCallback',
      published: true,
      categoryId: cat1.id,
    },
  });

  console.log('Created posts:', [post1, post2]);

  // 创建文章-标签关联
  await prisma.postTag.upsert({
    where: { postId_tagId: { postId: post1.id, tagId: tag1.id } },
    update: {},
    create: { postId: post1.id, tagId: tag1.id },
  });

  await prisma.postTag.upsert({
    where: { postId_tagId: { postId: post2.id, tagId: tag1.id } },
    update: {},
    create: { postId: post2.id, tagId: tag1.id },
  });

  await prisma.postTag.upsert({
    where: { postId_tagId: { postId: post2.id, tagId: tag3.id } },
    update: {},
    create: { postId: post2.id, tagId: tag3.id },
  });

  // 创建/更新关于页面
  await prisma.about.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: '关于我',
      content: '# 关于我\n\n你好！我是一名全栈开发工程师，热爱技术，喜欢分享。\n\n## 技术栈\n\n- 前端: React, Vue, TypeScript\n- 后端: Node.js, NestJS, Python\n- 数据库: PostgreSQL, MongoDB\n\n## 联系我\n\n欢迎通过以下方式与我交流：',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blog',
      socialLinks: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        email: 'hello@example.com',
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
