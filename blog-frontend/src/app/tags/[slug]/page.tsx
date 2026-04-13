'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag as TagIcon, ChevronRight } from 'lucide-react';
import { Container } from '@/components';
import { PostCard } from '@/components/PostCard';
import type { Post, Tag } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function TagDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [tag, setTag] = useState<Tag | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取所有文章
        const postsRes = await fetch(`${API_BASE_URL}/posts?published=true`);
        
        if (postsRes.ok) {
          const allPosts = await postsRes.json();
          const postsArray = Array.isArray(allPosts) ? allPosts : allPosts.data || [];
          
          // 筛选包含该标签的文章
          const taggedPosts = postsArray.filter((post: Post) => 
            post.tags?.some((t: Tag) => t.slug === slug)
          );
          setPosts(taggedPosts);
          
          // 获取标签信息
          const tagsRes = await fetch(`${API_BASE_URL}/tags`);
          if (tagsRes.ok) {
            const tags = await tagsRes.json();
            const tagsArray = Array.isArray(tags) ? tags : tags.data || [];
            const foundTag = tagsArray.find((t: Tag) => t.slug === slug);
            if (foundTag) {
              setTag(foundTag);
            }
          }
        } else {
          throw new Error('API 请求失败');
        }
      } catch (err) {
        console.error('获取标签文章失败:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      setLoading(true);
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <section className="min-h-screen py-24">
        <Container maxWidth="lg">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24">
      <Container maxWidth="lg">
        {/* 面包屑 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-cyan-500">首页</Link>
            <ChevronRight size={14} />
            <Link href="/tags" className="hover:text-cyan-500">标签</Link>
            <ChevronRight size={14} />
            <span className="text-cyan-500">{tag?.name || slug}</span>
          </div>
        </motion.div>

        {/* 标签信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <TagIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                <span className="gradient-text">{tag?.name || slug}</span>
              </h1>
              <p className="text-slate-500 mt-1">
                共 {posts.length} 篇文章
              </p>
            </div>
          </div>
        </motion.div>

        {/* 文章列表 */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/30"
          >
            <TagIcon size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">暂无文章</p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <PostCard post={post} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 错误提示 */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-slate-500 text-sm"
          >
            <p>数据加载失败，请确保后端服务已启动</p>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
