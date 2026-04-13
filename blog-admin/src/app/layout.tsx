import type { Metadata } from 'next';
import './globals.css';
import { ProtectedLayout } from '@/components/ProtectedLayout';

export const metadata: Metadata = {
  title: '博客管理后台',
  description: '博客内容管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ProtectedLayout>{children}</ProtectedLayout>
      </body>
    </html>
  );
}
