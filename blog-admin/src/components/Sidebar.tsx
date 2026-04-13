'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import {
  FileText,
  Tags,
  FolderTree,
  User,
  LogOut,
  History,
  Settings,
} from 'lucide-react';

const navItems = [
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
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">博客管理</h1>
            <p className="text-xs text-gray-400">内容管理系统</p>
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
