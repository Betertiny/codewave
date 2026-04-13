import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import WaterRippleBackground from '@/components/WaterRippleBackground';
import './globals.css';

export const metadata: Metadata = {
  title: '博客主题 - 个人技术博客',
  description: '分享技术心得，记录成长历程',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative overflow-x-hidden">
        {/* 水波纹背景效果 */}
        <WaterRippleBackground />
        
        <Providers>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
