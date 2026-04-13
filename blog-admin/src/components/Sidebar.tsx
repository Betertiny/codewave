'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import {
  LayoutDashboard,
  FileText,
  Tags,
  FolderTree,
  User,
  LogOut,
  History,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/', label: '仪表盘', icon: LayoutDashboard },
  { href: '/posts', label: '文章', icon: FileText },
  { href: '/tags', label: '标签', icon: Tags },
  { href: '/categories', label: '分类', icon: FolderTree },
  { href: '/about', label: '关于', icon: User },
  { href: '/logs', label: '日志', icon: History },
  { href: '/account', label: '账户', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { username, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* CodeWave Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            {/* CodeWave Waves icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
              <defs>
                <linearGradient id="sidebarWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                </linearGradient>
              </defs>
              <path d="M3 13 Q6 10, 9 13 T15 13 T21 13" fill="none" stroke="url(#sidebarWaveGrad)" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 17 Q6 14, 9 17 T15 17 T21 17" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 9 Q6 6, 9 9 T15 9 T21 9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">CodeWave</h1>
            <p className="text-xs text-gray-400">博客管理后台</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* User & Logout */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <span className="truncate">{username || 'Admin'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
