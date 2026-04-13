'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components';
import { Tag as TagIcon, ArrowRight } from 'lucide-react';
import type { Tag } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tags`);
        const data = await res.json();
        // 处理可能的嵌套格式 { data: [...] } 或直接使用数组
        const tagsArray = Array.isArray(data) ? data : data.data || data.items || [];
        setTags(tagsArray);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  // 按文章数量排序标签
  const sortedTags = [...tags].sort((a, b) => (b.postCount || 0) - (a.postCount || 0));

  return (
    <section className="py-24">
      <Container maxWidth="lg">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">标签</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            通过标签快速找到感兴趣的文章
          </p>
        </div>

        {/* 标签云 */}
        {loading ? (
          <div className="flex flex-wrap gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-10 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : sortedTags.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {sortedTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                <TagIcon size={16} className="text-blue-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {tag.name}
                </span>
                {tag.postCount !== undefined && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {tag.postCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <TagIcon size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">暂无标签</p>
          </div>
        )}
      </Container>
    </section>
  );
}
