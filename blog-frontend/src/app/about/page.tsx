'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components';
import { User, Mail, Github, Globe, Heart } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface About {
  title: string;
  content: string;
}

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/about`);
        if (res.ok) {
          const data = await res.json();
          setAbout(data);
        }
      } catch (error) {
        console.error('Failed to fetch about:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Globe, href: '#', label: 'Website' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <section className="py-24">
      <Container maxWidth="lg">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">关于我</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            了解这个博客背后的故事
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                {/* 头像 */}
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 mx-auto">
                  <User size={48} className="text-white" />
                </div>

                <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                  博客作者
                </h2>
                <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
                  全栈开发者 / 技术写作者
                </p>

                {/* 社交链接 */}
                <div className="flex justify-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>

                {/* 技能标签 */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">技术栈</h3>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'TypeScript', 'Next.js', 'PostgreSQL'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 主内容 */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  ))}
                </div>
              ) : about?.content ? (
                <MarkdownRenderer content={about.content} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">
                    暂无关于内容，请在后台编辑关于页面
                  </p>
                </div>
              )}

              {/* 底部信息 */}
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                <span>Made with</span>
                <Heart size={16} className="text-red-500 fill-red-500" />
                <span>and Next.js</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
