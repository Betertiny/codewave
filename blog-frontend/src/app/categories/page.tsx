'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components';
import { FolderOpen, ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        // 处理可能的嵌套格式
        const categoriesArray = Array.isArray(data) ? data : data.data || [];
        setCategories(categoriesArray);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-24">
      <Container maxWidth="lg">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">分类</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            浏览所有文章分类，找到你感兴趣的内容
          </p>
        </div>

        {/* 分类网格 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FolderOpen size={24} className="text-white" />
                  </div>
                  <ArrowRight size={20} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FolderOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">暂无分类</p>
          </div>
        )}
      </Container>
    </section>
  );
}
