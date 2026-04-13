import Link from 'next/link';
import { BookOpen, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen size={22} className="text-white" />
              </div>
              <span className="font-semibold text-xl text-slate-900 dark:text-white">
                我的博客
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              分享技术心得，记录成长历程。这是一个专注于技术内容的个人博客，
              涵盖前端开发、后端架构、云原生等多个领域。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">快速链接</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: '首页' },
                { href: '/posts', label: '文章' },
                { href: '/categories', label: '分类' },
                { href: '/about', label: '关于' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">关注我</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-colors"
                aria-label="邮箱"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} 我的博客. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Made with ❤️ and Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
