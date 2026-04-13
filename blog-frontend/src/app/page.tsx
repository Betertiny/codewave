'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Tag, Folder, Search, Clock, TrendingUp } from 'lucide-react';
import { PostCard, Container } from '@/components';
import type { Post } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts?published=true`);
        const data = await res.json();
        const postsArray = Array.isArray(data) ? data : data.data || data.items || [];
        setPosts(postsArray);
        // 设置最新3篇文章
        setLatestPosts(postsArray.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/posts?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    { icon: BookOpen, title: '技术文章', desc: '深入浅出的技术教程和最佳实践' },
    { icon: Sparkles, title: '最新资讯', desc: '追踪前沿技术动态和行业趋势' },
    { icon: Folder, title: '分类整理', desc: '系统化的知识体系构建' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          {/* 装饰性渐变背景 */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <Container maxWidth="lg" className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 标签 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg mb-8"
            >
              <Sparkles size={16} className="text-cyan-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                探索技术的无限可能
              </span>
            </motion.div>

            {/* 主标题 */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">发现</span>
              <br />
              <span className="text-slate-900 dark:text-white">技术与创意的交汇点</span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed">
              在这里，我分享工作中的实战经验、技术踩坑记录以及个人成长的思考。
              每一篇文章都经过精心打磨，旨在帮助读者解决实际问题。
            </p>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-200" />
                <div className="relative flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                  <Search size={20} className="ml-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索文章..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-4 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-lg"
                  />
                  <button
                    type="submit"
                    className="m-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
                  >
                    搜索
                  </button>
                </div>
              </div>
            </form>

            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/posts" className="btn-primary text-lg px-8 py-4">
                浏览文章
                <ArrowRight size={20} />
              </Link>
              <Link href="/about" className="btn-secondary text-lg px-8 py-4">
                了解更多
              </Link>
            </div>
          </motion.div>

          {/* 特性卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* 最新文章 */}
      <section className="py-20 relative z-10">
        <Container maxWidth="lg">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">最新文章</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">探索最近发布的精彩内容</p>
              </div>
            </div>
            <Link
              href="/posts"
              className="flex items-center gap-2 text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
            >
              查看全部
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/30">
              <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">暂无文章</p>
              <Link href="/posts" className="inline-flex items-center gap-2 mt-4 text-cyan-500 hover:text-cyan-600">
                浏览全部 <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* 浏览文章入口 */}
      <section className="py-16 relative z-10">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-600 p-10 md:p-16"
          >
            {/* 装饰 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                准备好开始探索了吗？
              </h2>
              <p className="text-cyan-100 text-lg mb-8 max-w-xl mx-auto">
                探索 {posts.length} 篇精心撰写的技术文章，开启你的学习之旅
              </p>
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-cyan-600 font-semibold hover:bg-cyan-50 transition-colors shadow-lg"
              >
                开始探索
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
