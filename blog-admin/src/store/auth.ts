'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LoginLog {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  success: boolean;
}

interface OperationLog {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  targetId?: string;
  details?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  username: string;
  password: string;
  lastLogin: { ip: string; time: string } | null;
  loginLogs: LoginLog[];
  operationLogs: OperationLog[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCredentials: (username: string, password: string) => boolean;
  addLoginLog: (log: Omit<LoginLog, 'id'>) => void;
  addOperationLog: (log: Omit<OperationLog, 'id'>) => void;
}

// ⚠️ 安全提醒：请在生产环境中修改以下默认账号密码！
// 建议通过环境变量或配置中心管理
const DEFAULT_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'CHANGE_ME_IN_PRODUCTION';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
      lastLogin: null,
      loginLogs: [],
      operationLogs: [],

      login: async (username: string, password: string) => {
        // 模拟 API 延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        const state = get();
        if (
          username === state.username &&
          password === state.password
        ) {
          // 获取客户端 IP（通过外部服务）
          let clientIp = '127.0.0.1';
          try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            clientIp = data.ip || '127.0.0.1';
          } catch (e) {
            // 忽略错误，使用默认值
          }

          const now = new Date().toISOString();
          set({
            isAuthenticated: true,
            lastLogin: { ip: clientIp, time: now },
          });

          // 记录登录日志
          get().addLoginLog({
            timestamp: now,
            ip: clientIp,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
            success: true,
          });

          return true;
        }

        // 记录失败登录
        const now = new Date().toISOString();
        let clientIp = '127.0.0.1';
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const data = await res.json();
          clientIp = data.ip || '127.0.0.1';
        } catch (e) {}

        get().addLoginLog({
          timestamp: now,
          ip: clientIp,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
          success: false,
        });

        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      updateCredentials: (newUsername: string, newPassword: string) => {
        if (!newUsername.trim() || !newPassword.trim()) {
          return false;
        }
        if (newPassword.length < 6) {
          return false;
        }
        set({
          username: newUsername.trim(),
          password: newPassword,
        });
        return true;
      },

      addLoginLog: (log) => {
        set((state) => ({
          loginLogs: [
            { ...log, id: Date.now().toString() },
            ...state.loginLogs.slice(0, 99), // 保留最近 100 条
          ],
        }));
      },

      addOperationLog: (log) => {
        set((state) => ({
          operationLogs: [
            { ...log, id: Date.now().toString() },
            ...state.operationLogs.slice(0, 99),
          ],
        }));
      },
    }),
    {
      name: 'admin-auth',
    }
  )
);

// 操作日志记录辅助函数
export const logOperation = (
  action: string,
  target: string,
  targetId?: string,
  details?: string
) => {
  const store = useAuthStore.getState();
  store.addOperationLog({
    timestamp: new Date().toISOString(),
    action,
    target,
    targetId,
    details,
  });
};
