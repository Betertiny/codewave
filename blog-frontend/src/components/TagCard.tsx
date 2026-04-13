'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Tag } from '@/types';

interface TagCardProps {
  tag: Tag;
  count?: number;
  index?: number;
}

export function TagCard({ tag, count, index = 0 }: TagCardProps) {
  const colors = [
    'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
    'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  ];

  const colorClass = colors[tag.id % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/tags/${tag.slug}`}>
        <span
          className={`${colorClass} px-4 py-2 rounded-full text-sm cursor-pointer hover:scale-105 transition-transform inline-block`}
        >
          {tag.name}
          {count !== undefined && (
            <span className="ml-1 opacity-60">({count})</span>
          )}
        </span>
      </Link>
    </motion.div>
  );
}
