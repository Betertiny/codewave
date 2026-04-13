'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Folder, ChevronRight } from 'lucide-react';
import { Container } from '@/components';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface CategoryInfo {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export default function CategoryPostsPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取分类信息和文章
        const [categoryRes, postsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/posts?published=true`)
        ]);
        
        if (categoryRes.ok && postsRes.ok) {
          const categories = await categoryRes.json();
          const categoriesArray = Array.isArray(categories) ? categories : categories.data || [];
          const foundCategory = categoriesArray.find((c: CategoryInfo) => c.slug === slug);
          
          if (foundCategory) {
            setCategory(foundCategory);
          }
          
          const allPosts = await postsRes.json();
          const postsArray = Array.isArray(allPosts) ? allPosts : allPosts.data || [];
          // 筛选属于该分类的文章
          const categoryPosts = postsArray.filter((p: Post) => p.category?.slug === slug);
          setPosts(categoryPosts);
        } else {
          throw new Error('API 请求失败');
        }
      } catch (err) {
        console.error('获取分类文章失败:', err);
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
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/categories"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回分类</span>
          </Link>
        </motion.div>

        {/* 分类信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-cyan-500">首页</Link>
            <ChevronRight size={14} />
            <Link href="/categories" className="hover:text-cyan-500">分类</Link>
            <ChevronRight size={14} />
            <span className="text-cyan-500">{category?.name || slug}</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600"
            >
              <Folder className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                {category?.name || slug}
              </h1>
              <p className="text-slate-500 mt-1">
                共 {posts.length} 篇文章
              </p>
              {category?.description && (
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {category.description}
                </p>
              )}
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
            <Folder size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">该分类下暂无文章</p>
            <p className="text-slate-400 text-sm mt-2">在后台关联文章后即可在此展示</p>
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
