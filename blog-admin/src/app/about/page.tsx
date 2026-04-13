'use client';

import { useEffect, useState } from 'react';
import { aboutApi } from '@/lib/api';
import type { About } from '@/types';
import { Toast, useToast } from '@/components/Toast';
import { Loading } from '@/components/Loading';
import { Save, Eye, User, Globe, Mail, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await aboutApi.getAbout();
      setAbout(res);
    } catch (error) {
      showToast('获取关于页面失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!about) return;
    setSaving(true);
    try {
      await aboutApi.updateAbout(about);
      logOperation('更新', '关于页面', undefined, `标题: ${about.title || '未设置'}`);
      showToast('保存成功', 'success');
    } catch (error: any) {
      showToast(error.message || '保存失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">关于页面</h1>
          <p className="text-gray-500 text-sm mt-1">编辑个人介绍和联系方式</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="btn btn-secondary"
          >
            <Eye className="w-4 h-4" />
            {preview ? '编辑' : '预览'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
          >
            <Save className="w-4 h-4" />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {preview ? (
        /* Preview Mode */
        <div className="card p-8">
          <div className="text-center mb-8">
            {about?.avatar && (
              <img
                src={about.avatar}
                alt="头像"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            {about?.title && (
              <h1 className="text-3xl font-bold text-gray-900">{about.title}</h1>
            )}
          </div>
          
          {about?.socialLinks && (
            <div className="flex justify-center gap-4 mb-8 pb-6 border-b">
              {about.socialLinks.github && (
                <a href={about.socialLinks.github} target="_blank" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {about.socialLinks.twitter && (
                <a href={about.socialLinks.twitter} target="_blank" className="text-gray-600 hover:text-gray-900">
                  Twitter
                </a>
              )}
              {about.socialLinks.email && (
                <a href={`mailto:${about.socialLinks.email}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          )}

          {about?.content && (
            <div className="prose max-w-none">
              <ReactMarkdown>{about.content}</ReactMarkdown>
            </div>
          )}
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-5">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              基本信息
            </h2>
            <div className="space-y-5">
              <div className="form-group mb-0">
                <label className="label">标题</label>
                <input
                  type="text"
                  value={about?.title || ''}
                  onChange={(e) => setAbout({ ...about!, title: e.target.value })}
                  className="input"
                  placeholder="例如：关于我"
                />
              </div>

              <div className="form-group mb-0">
                <label className="label">头像 URL</label>
                <div className="flex items-center gap-4">
                  <input
                    type="url"
                    value={about?.avatar || ''}
                    onChange={(e) => setAbout({ ...about!, avatar: e.target.value })}
                    className="input flex-1"
                    placeholder="https://..."
                  />
                  {about?.avatar && (
                    <img
                      src={about.avatar}
                      alt="头像预览"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              社交链接
            </h2>
            <div className="space-y-4">
              <div className="form-group mb-0">
                <label className="label flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub
                </label>
                <input
                  type="url"
                  value={about?.socialLinks?.github || ''}
                  onChange={(e) => setAbout({
                    ...about!,
                    socialLinks: { ...about?.socialLinks, github: e.target.value }
                  })}
                  className="input"
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="form-group mb-0">
                <label className="label">Twitter</label>
                <input
                  type="url"
                  value={about?.socialLinks?.twitter || ''}
                  onChange={(e) => setAbout({
                    ...about!,
                    socialLinks: { ...about?.socialLinks, twitter: e.target.value }
                  })}
                  className="input"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="form-group mb-0">
                <label className="label flex items-center gap-2">
                  <Mail className="w-4 h-4" /> 邮箱
                </label>
                <input
                  type="email"
                  value={about?.socialLinks?.email || ''}
                  onChange={(e) => setAbout({
                    ...about!,
                    socialLinks: { ...about?.socialLinks, email: e.target.value }
                  })}
                  className="input"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">内容</h2>
            <textarea
              value={about?.content || ''}
              onChange={(e) => setAbout({ ...about!, content: e.target.value })}
              className="input font-mono min-h-[300px]"
              placeholder="# 关于&#10;&#10;使用 Markdown 格式编写内容..."
            />
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
