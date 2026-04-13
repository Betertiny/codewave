'use client';

import { useEffect, useState, useMemo } from 'react';
import { PostCard, Container } from '@/components';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Post } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const PAGE_SIZE_OPTIONS = [10, 30, 50, 100];

export default function PostsPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts?published=true`);
        const data = await res.json();
        // 处理可能的嵌套格式 { data: [...] } 或直接使用数组
        const postsArray = Array.isArray(data) ? data : data.data || data.items || [];
        setAllPosts(postsArray);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 过滤文章
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allPosts, searchTerm]);

  // 分页计算
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  // 重置到第一页当搜索或分页大小改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  // 分页组件
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
            currentPage === i
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="w-10 h-10 rounded-lg text-sm font-medium bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              1
            </button>
            {startPage > 2 && <span className="text-slate-400">...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-slate-400">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="w-10 h-10 rounded-lg text-sm font-medium bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <section className="py-24">
      <Container maxWidth="lg">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">全部文章</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            共 {filteredPosts.length} 篇文章，持续更新中...
          </p>
        </div>

        {/* 搜索和分页大小选择 */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size} 条/页</option>
              ))}
            </select>
          </div>
        </div>

        {/* 文章列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-20">
            <Filter size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">未找到相关文章</p>
          </div>
        )}
      </Container>
    </section>
  );
}
