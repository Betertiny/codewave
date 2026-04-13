'use client';

import Link from 'next/link';
import { Calendar, Eye, Clock } from 'lucide-react';
import { formatDate, readingTime } from '@/lib/utils';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <article className="h-full flex flex-col rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
        {/* 封面图 */}
        {post.coverImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* 内容 */}
        <div className="flex-1 flex flex-col p-5">
          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 标题 */}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
            {post.title}
          </h3>

          {/* 摘要 */}
          {post.excerpt && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-1">
              {post.excerpt}
            </p>
          )}

          {/* 元信息 */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700/50">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {readingTime(post.content)} 分钟
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {post.viewCount || 0}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
