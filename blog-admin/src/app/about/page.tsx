'use client';

import { useEffect, useState } from 'react';
import { aboutApi } from '@/lib/api';
import type { About, Skill } from '@/types';
import { Toast, useToast } from '@/components/Toast';
import { Loading } from '@/components/Loading';
import ImageUpload from '@/components/ImageUpload';
import { Save, Eye, User, Globe, Mail, Github, Plus, X, Code } from 'lucide-react';
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
      showToast('保存成功', 'success');
    } catch (error: any) {
      showToast(error.message || '保存失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 技能管理
  const addSkill = () => {
    const newSkill: Skill = { name: '', level: 50, category: '技术' };
    setAbout({
      ...about!,
      skills: [...(about?.skills || []), newSkill],
    });
  };

  const updateSkill = (index: number, updates: Partial<Skill>) => {
    if (!about?.skills) return;
    const newSkills = [...about.skills];
    newSkills[index] = { ...newSkills[index], ...updates };
    setAbout({ ...about!, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    if (!about?.skills) return;
    const newSkills = about.skills.filter((_, i) => i !== index);
    setAbout({ ...about!, skills: newSkills });
  };

  // 预设技能模板
  const skillTemplates = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js',
    'Python', 'Java', 'Go', 'Rust', 'C++',
    'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'Git', 'Linux',
    'HTML/CSS', 'Tailwind CSS', 'Next.js', 'NestJS', 'Spring Boot',
  ];

  const addSkillFromTemplate = (name: string) => {
    if (!about?.skills?.find(s => s.name === name)) {
      setAbout({
        ...about!,
        skills: [...(about.skills || []), { name, level: 50, category: '技术' }],
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">关于页面</h1>
          <p className="text-gray-500 text-sm mt-1">编辑个人介绍、技能和联系方式</p>
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

          {/* Skills preview */}
          {about?.skills && about.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">技能</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {about.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill.name}
                    {skill.level && <span className="ml-1 text-gray-400">({skill.level}%)</span>}
                  </span>
                ))}
              </div>
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
                <label className="label">头像</label>
                <ImageUpload
                  value={about?.avatar || ''}
                  onChange={(url) => setAbout({ ...about!, avatar: url })}
                  accept="image/*"
                  maxSize={2}
                />
              </div>
            </div>
          </div>

          {/* Skills Management */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Code className="w-5 h-5 text-gray-400" />
              技能
            </h2>
            
            {/* Skill templates */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">快速添加：</p>
              <div className="flex flex-wrap gap-2">
                {skillTemplates.slice(0, 10).map((name) => (
                  <button
                    key={name}
                    onClick={() => addSkillFromTemplate(name)}
                    disabled={about?.skills?.find(s => s.name === name)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      about?.skills?.find(s => s.name === name)
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    + {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills list */}
            <div className="space-y-3">
              {about?.skills && about.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, { name: e.target.value })}
                    className="input flex-1"
                    placeholder="技能名称"
                  />
                  <input
                    type="text"
                    value={skill.category || ''}
                    onChange={(e) => updateSkill(index, { category: e.target.value })}
                    className="input w-28"
                    placeholder="分类"
                  />
                  <div className="flex items-center gap-2 w-32">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level || 50}
                      onChange={(e) => updateSkill(index, { level: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 w-8">{skill.level || 50}%</span>
                  </div>
                  <button
                    onClick={() => removeSkill(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {(!about?.skills || about.skills.length === 0) && (
                <div className="text-center py-6 text-gray-400 text-sm">
                  暂无技能，点击下方按钮添加
                </div>
              )}
            </div>

            <button
              onClick={addSkill}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加技能
            </button>
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
