'use client';

import { useEffect, useState } from 'react';
import { tagsApi } from '@/lib/api';
import type { Tag, CreateTagDto } from '@/types';
import { Modal } from '@/components/Modal';
import { Toast, useToast } from '@/components/Toast';
import { Loading } from '@/components/Loading';
import { Plus, Pencil, Trash2, Tag as TagIcon } from 'lucide-react';

const TAG_COLORS = [
  { name: 'red', bg: 'bg-red-500' },
  { name: 'orange', bg: 'bg-orange-500' },
  { name: 'yellow', bg: 'bg-yellow-500' },
  { name: 'green', bg: 'bg-green-500' },
  { name: 'teal', bg: 'bg-teal-500' },
  { name: 'blue', bg: 'bg-blue-500' },
  { name: 'indigo', bg: 'bg-indigo-500' },
  { name: 'purple', bg: 'bg-purple-500' },
  { name: 'pink', bg: 'bg-pink-500' },
  { name: 'gray', bg: 'bg-gray-500' },
];

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<CreateTagDto>({ name: '', slug: '', color: '' });
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await tagsApi.getTags();
      setTags(res.data || []);
    } catch (error) {
      showToast('获取标签列表失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTag) {
        await tagsApi.updateTag(editingTag.id, formData);
        logOperation('更新', '标签', editingTag.id.toString(), `名称: ${formData.name}`);
        showToast('标签更新成功', 'success');
      } else {
        const res = await tagsApi.createTag(formData);
        logOperation('创建', '标签', res.id?.toString(), `名称: ${formData.name}`);
        showToast('标签创建成功', 'success');
      }
      setIsModalOpen(false);
      resetForm();
      fetchTags();
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, slug: tag.slug, color: tag.color || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个标签吗？')) return;
    try {
      await tagsApi.deleteTag(id);
      logOperation('删除', '标签', id.toString());
      showToast('标签删除成功', 'success');
      fetchTags();
    } catch (error: any) {
      showToast(error.message || '删除失败', 'error');
    }
  };

  const resetForm = () => {
    setEditingTag(null);
    setFormData({ name: '', slug: '', color: '' });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const getTagColor = (color?: string) => {
    if (!color) return 'bg-blue-500';
    const found = TAG_COLORS.find(c => c.name === color);
    return found?.bg || 'bg-blue-500';
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">标签管理</h1>
          <p className="text-gray-500 text-sm mt-1">共 {tags.length} 个标签</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          新建标签
        </button>
      </div>

      {/* Tags Grid */}
      <div className="card p-6">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <span className={`w-3 h-3 rounded-full ${getTagColor(tag.color)}`} />
                <span className="font-medium text-gray-900">{tag.name}</span>
                <span className="text-gray-400 text-sm font-mono">/{tag.slug}</span>
                <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="btn btn-icon p-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="btn btn-icon p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">暂无标签，点击右上角新建</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingTag ? '编辑标签' : '新建标签'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label className="label">名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
              className="input"
              placeholder="例如：技术"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="input font-mono"
              placeholder="例如：tech"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">颜色</label>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.name })}
                  className={`w-8 h-8 rounded-full ${color.bg} transition-transform ${
                    formData.color === color.name ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="btn btn-secondary"
            >
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTag ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
