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
        {/* CodeWave Waves logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 relative overflow-hidden">
            {/* Animated wave pattern */}
            <svg viewBox="0 0 40 40" className="w-12 h-12 text-white relative z-10">
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                </linearGradient>
              </defs>
              {/* Wave 1 */}
              <path 
                d="M5 25 Q10 20, 15 25 T25 25 T35 25" 
                fill="none" 
                stroke="url(#waveGrad)" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="animate-pulse"
              />
              {/* Wave 2 */}
              <path 
                d="M5 18 Q10 13, 15 18 T25 18 T35 18" 
                fill="none" 
                stroke="rgba(255,255,255,0.7)" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                style={{ animationDelay: '0.5s' }}
              />
              {/* Wave 3 */}
              <path 
                d="M5 31 Q10 26, 15 31 T25 31 T35 31" 
                fill="none" 
                stroke="rgba(255,255,255,0.5)" 
                strokeWidth="2" 
                strokeLinecap="round"
                style={{ animationDelay: '1s' }}
              />
            </svg>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
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
