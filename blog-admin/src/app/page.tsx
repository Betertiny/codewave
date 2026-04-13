'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/posts');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse text-gray-400">加载中...</div>
    </div>
  );
}
