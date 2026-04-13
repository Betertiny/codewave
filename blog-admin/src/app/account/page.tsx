'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Toast, useToast } from '@/components/Toast';
import { User, Lock, Shield, Eye, EyeOff, Check, X } from 'lucide-react';

export default function AccountPage() {
  const { username, lastLogin, updateCredentials } = useAuthStore();
  const { toast, showToast, hideToast } = useToast();

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateCredentials = async () => {
    if (!currentPassword) {
      showToast('请输入当前密码', 'error');
      return;
    }

    const store = useAuthStore.getState();
    if (currentPassword !== store.password) {
      showToast('当前密码错误', 'error');
      return;
    }

    if (!newUsername.trim()) {
      showToast('用户名不能为空', 'error');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      showToast('新密码至少需要6位', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('两次密码输入不一致', 'error');
      return;
    }

    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = store.updateCredentials(newUsername, newPassword);
    if (success) {
      showToast('账户信息已更新', 'success');
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } else {
      showToast('更新失败', 'error');
    }
    setIsUpdating(false);
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">账户设置</h1>
        <p className="text-gray-500 text-sm mt-1">管理您的账户信息和登录密码</p>
      </div>

      {/* Account Info Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{username}</h2>
            <p className="text-sm text-gray-500">管理员账户</p>
          </div>
        </div>

        {/* Last Login Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">上次登录信息</span>
          </div>
          {lastLogin ? (
            <div className="ml-7 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="text-gray-400">IP：</span>
                <span className="font-mono">{lastLogin.ip}</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="text-gray-400">时间：</span>
                {formatDateTime(lastLogin.time)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 ml-7">暂无登录记录</p>
          )}
        </div>
      </div>

      {/* Update Credentials Card */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">修改账户信息</h3>
            <p className="text-xs text-gray-500">更新用户名或密码</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Current Password */}
          <div className="form-group">
            <label className="label">当前密码 *</label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input pr-10"
                placeholder="输入当前密码以验证身份"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Username */}
          <div className="form-group">
            <label className="label">新用户名</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="input"
              placeholder="输入新用户名（留空则不修改）"
            />
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="label">新密码</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input pr-10"
              placeholder="输入新密码（至少6位）"
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="label">确认新密码</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input pr-10"
              placeholder="再次输入新密码"
            />
            {confirmPassword && (
              <div className="flex items-center gap-2 mt-2">
                {newPassword === confirmPassword ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">密码一致</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-600">密码不一致</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleUpdateCredentials}
              disabled={
                isUpdating ||
                !currentPassword ||
                (!newUsername.trim() && !newPassword)
              }
              className="btn btn-primary w-full"
            >
              {isUpdating ? '更新中...' : '更新账户信息'}
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
