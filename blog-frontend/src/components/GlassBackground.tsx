'use client';

import { useEffect, useState } from 'react';

export function GlassBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 主渐变光效 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
      
      {/* 浮动光点 - 只在客户端渲染以避免 hydration 问题 */}
      {mounted && (
        <>
          <div 
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400 rounded-full animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <div 
            className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          />
          <div 
            className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-pink-400 rounded-full animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          />
        </>
      )}
      
      {/* 网格背景 */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
