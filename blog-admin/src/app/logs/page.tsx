'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { formatDateTime } from '@/lib/utils';
import {
  History,
  LogIn,
  Settings,
  FileText,
  Tag,
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  User,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';

// 操作类型图标映射
const ACTION_ICONS: Record<string, any> = {
  '创建': Plus,
  '更新': Pencil,
  '删除': Trash2,
  '发布': Eye,
  '取消发布': EyeOff,
  '登录': LogIn,
  '登出': LogIn,
  '修改': Settings,
  '访问': Eye,
};

// 操作类型颜色
const ACTION_COLORS: Record<string, string> = {
  '创建': 'bg-green-100 text-green-700',
  '更新': 'bg-blue-100 text-blue-700',
  '删除': 'bg-red-100 text-red-700',
  '发布': 'bg-green-100 text-green-700',
  '取消发布': 'bg-yellow-100 text-yellow-700',
  '登录': 'bg-indigo-100 text-indigo-700',
  '登出': 'bg-gray-100 text-gray-700',
  '修改': 'bg-blue-100 text-blue-700',
  '访问': 'bg-purple-100 text-purple-700',
};

export default function LogsPage() {
  const { loginLogs, operationLogs } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'login' | 'operation'>('operation');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  const renderLoginLogs = () => (
    <div className="space-y-3">
      {loginLogs.length === 0 ? (
        <div className="text-center py-12">
          <LogIn className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">暂无登录记录</p>
        </div>
      ) : (
        loginLogs.map((log) => (
          <div
            key={log.id}
            className={`card p-4 transition-all ${
              log.success ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    log.success ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <LogIn
                    className={`w-5 h-5 ${log.success ? 'text-green-600' : 'text-red-600'}`}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {log.success ? '登录成功' : '登录失败'}
                  </p>
                  <p className="text-sm text-gray-500 font-mono">{log.ip}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{formatDateTime(log.timestamp)}</p>
              </div>
            </div>
            {expandedItems.has(log.id) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">User Agent:</p>
                <p className="text-xs text-gray-600 font-mono break-all bg-gray-50 p-2 rounded">
                  {log.userAgent}
                </p>
              </div>
            )}
            <button
              onClick={() => toggleExpand(log.id)}
              className="mt-2 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
            >
              {expandedItems.has(log.id) ? (
                <>
                  <ChevronUp className="w-3 h-3" /> 收起详情
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> 查看详情
                </>
              )}
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderOperationLogs = () => (
    <div className="space-y-3">
      {operationLogs.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">暂无操作记录</p>
          <p className="text-xs text-gray-400 mt-1">操作记录将在您执行操作时自动生成</p>
        </div>
      ) : (
        operationLogs.map((log) => {
          const Icon = ACTION_ICONS[log.action] || Settings;
          const colorClass = ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-700';

          return (
            <div key={log.id} className="card p-4 border-l-4 border-l-blue-500">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{log.action}</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-700">{log.target}</span>
                      {log.targetId && (
                        <span className="text-xs text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                          ID: {log.targetId}
                        </span>
                      )}
                    </div>
                    {log.details && (
                      <p className="text-sm text-gray-500 mt-1">{log.details}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(log.timestamp)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">日志管理</h1>
          <p className="text-gray-500 text-sm mt-1">
            查看登录记录和操作日志
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setActiveTab('operation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'operation'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <History className="w-4 h-4" />
            操作日志
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'login'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LogIn className="w-4 h-4" />
            登录日志
            {loginLogs.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {loginLogs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{operationLogs.length}</p>
              <p className="text-xs text-gray-500">操作记录</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{loginLogs.filter(l => l.success).length}</p>
              <p className="text-xs text-gray-500">成功登录</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{loginLogs.filter(l => !l.success).length}</p>
              <p className="text-xs text-gray-500">失败登录</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{loginLogs.length}</p>
              <p className="text-xs text-gray-500">登录记录</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Content */}
      <div className="card p-6">
        {activeTab === 'operation' ? renderOperationLogs() : renderLoginLogs()}
      </div>
    </div>
  );
}
