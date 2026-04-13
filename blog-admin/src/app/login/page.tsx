'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(username, password);
    if (success) {
      router.push('/posts');
    } else {
      setError('用户名或密码错误');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Apple-style background blur orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Apple-style login card */}
      <div className="relative w-full max-w-md px-6">
        {/* Apple logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">博客管理后台</h1>
          <p className="text-gray-400 text-sm">请登录以继续</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username input */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-200" />
            <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700/50">
              <div className="flex items-center px-4 py-4">
                <User className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="用户名"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password input */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-200" />
            <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700/50">
              <div className="flex items-center px-4 py-4">
                <Lock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="密码"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit button - Apple style */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-200" />
            <div className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>登录中...</span>
                </>
              ) : (
                <span>登录</span>
              )}
            </div>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-xs">© 2024 CodeWave Blog. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
