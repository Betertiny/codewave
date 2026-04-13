'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Eye, Clock, ArrowLeft, Twitter, Linkedin, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { Container } from '@/components';
import { formatDate, readingTime } from '@/lib/utils';
import type { Post } from '@/types';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function PostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
        if (!response.ok) {
          throw new Error('API 请求失败');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('获取文章失败:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">文章未找到</h1>
        <Link href="/" className="text-primary-500 hover:text-primary-600">返回首页</Link>
      </div>
    );
  }

  return (
    <>
      <main className="relative z-10 pt-20 pb-16">
        {/* 面包屑导航 */}
        <Container maxWidth="lg" className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-primary-500 transition-colors">首页</Link>
            <ChevronRight size={14} />
            <Link href="/posts" className="hover:text-primary-500 transition-colors">文章</Link>
            <ChevronRight size={14} />
            <span className="truncate max-w-[200px]">{post.title}</span>
          </div>
        </Container>

        {/* 封面图 */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-64 md:h-96 overflow-hidden relative"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-transparent to-transparent" />
          </motion.div>
        )}

        <Container maxWidth="lg" className="relative z-20">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 md:p-10 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
          >
            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 text-sm rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* 标题 */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                B
              </div>
              <span>作者</span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {readingTime(post.content)} 分钟阅读
              </span>
              <span className="flex items-center gap-1">
                <Eye size={16} />
                {post.viewCount || 0} 次阅读
              </span>
            </div>

            {/* 分享按钮 */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-sm text-gray-500 dark:text-gray-400">分享:</span>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Twitter size={18} className="text-blue-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Linkedin size={18} className="text-blue-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <LinkIcon size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6" />

            {/* 文章内容 */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownRenderer content={post.content} />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-8" />

            {/* 底部导航 */}
            <div className="flex justify-between items-center pt-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft size={18} />
                返回首页
              </Link>
            </div>
          </motion.article>
        </Container>
      </main>

      {/* 错误提示 */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 text-sm mt-4"
        >
          <p>当前无法获取文章数据，请确保后端服务已启动</p>
        </motion.div>
      )}
    </>
  );
}
