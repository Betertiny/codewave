'use client';

import { useEffect, useState } from 'react';
import { categoriesApi } from '@/lib/api';
import type { Category, CreateCategoryDto } from '@/types';
import { formatDate } from '@/lib/utils';
import { Modal } from '@/components/Modal';
import { Toast, useToast } from '@/components/Toast';
import { Loading } from '@/components/Loading';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import { logOperation } from '@/store/auth';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryDto>({ name: '', slug: '', description: '' });
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getCategories();
      setCategories(res.data || []);
    } catch (error) {
      showToast('获取分类列表失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, formData);
        showToast('分类更新成功', 'success');
      } else {
        await categoriesApi.createCategory(formData);
        showToast('分类创建成功', 'success');
      }
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug, description: category.description || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return;
    try {
      await categoriesApi.deleteCategory(id);
      logOperation('删除', '分类', id.toString());
      showToast('分类删除成功', 'success');
      fetchCategories();
    } catch (error: any) {
      showToast(error.message || '删除失败', 'error');
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">分类管理</h1>
          <p className="text-gray-500 text-sm mt-1">共 {categories.length} 个分类</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          新建分类
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FolderTree className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">/{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="btn btn-icon"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="btn btn-icon text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="mt-3 text-sm text-gray-600">{category.description}</p>
            )}
            <p className="mt-3 text-xs text-gray-400">
              创建于 {formatDate(category.createdAt)}
            </p>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="col-span-full card p-12 text-center">
            <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">暂无分类，点击右上角新建</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingCategory ? '编辑分类' : '新建分类'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label className="label">名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
              className="input"
              placeholder="例如：技术文章"
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
            <label className="label">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="分类的简要描述..."
            />
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
              {editingCategory ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
