'use client';

import { useEffect, useState } from 'react';
import { postsApi, tagsApi, categoriesApi } from '@/lib/api';
import type { Post, Tag, Category, CreatePostDto } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Modal } from '@/components/Modal';
import { Toast, useToast } from '@/components/Toast';
import { Loading } from '@/components/Loading';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, FileText, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { logOperation } from '@/store/auth';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    published: false,
    categoryId: undefined,
    tagIds: [],
  });

  useEffect(() => {
    fetchPosts();
    fetchTags();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await postsApi.getPosts({ pageSize: 100 });
      setPosts(res.data);
    } catch (error) {
      showToast('获取文章列表失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await tagsApi.getTags();
      setAllTags(res.data || []);
    } catch (error) {
      console.error('获取标签失败:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getCategories();
      setAllCategories(res.data || []);
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await postsApi.updatePost(editingPost.id, formData);
        logOperation('更新', '文章', editingPost.id.toString(), `标题: ${formData.title}`);
        showToast('文章更新成功', 'success');
      } else {
        const res = await postsApi.createPost(formData);
        logOperation('创建', '文章', res.id?.toString(), `标题: ${formData.title}`);
        showToast('文章创建成功', 'success');
      }
      setIsModalOpen(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      coverImage: post.coverImage || '',
      published: post.published,
      categoryId: post.categoryId,
      tagIds: post.tags?.map(t => t.id) || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    try {
      await postsApi.deletePost(id);
      logOperation('删除', '文章', id.toString());
      showToast('文章删除成功', 'success');
      fetchPosts();
    } catch (error: any) {
      showToast(error.message || '删除失败', 'error');
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      await postsApi.updatePost(post.id, { published: !post.published });
      logOperation(post.published ? '取消发布' : '发布', '文章', post.id.toString(), post.title);
      showToast(post.published ? '已取消发布' : '已发布', 'success');
      fetchPosts();
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      published: false,
      categoryId: undefined,
      tagIds: [],
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">文章管理</h1>
          <p className="text-gray-500 text-sm mt-1">共 {posts.length} 篇文章</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          新建文章
        </button>
      </div>

      {/* Search */}
      <div className="card p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>标题</th>
              <th>Slug</th>
              <th>状态</th>
              <th>分类</th>
              <th>更新时间</th>
              <th className="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-gray-500 font-mono">{post.slug}</span>
                </td>
                <td>
                  <span className={`badge ${post.published ? 'badge-success' : 'badge-draft'}`}>
                    {post.published ? '已发布' : '草稿'}
                  </span>
                </td>
                <td>
                  {post.category ? (
                    <span className="badge badge-primary">{post.category.name}</span>
                  ) : (
                    <span className="text-gray-400 text-sm">未分类</span>
                  )}
                </td>
                <td>
                  <span className="text-sm text-gray-500">{formatDateTime(post.updatedAt)}</span>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className="btn btn-icon"
                      title={post.published ? '取消发布' : '发布'}
                    >
                      {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="btn btn-icon"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="btn btn-icon text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPosts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  暂无文章，点击右上角新建
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingPost ? '编辑文章' : '新建文章'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                className="input"
                placeholder="输入文章标题"
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
                placeholder="article-slug"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">摘要</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="input"
              rows={2}
              placeholder="简短描述..."
            />
          </div>

          <div className="form-group">
            <label className="label">封面图片 URL</label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="input"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">分类</label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? Number(e.target.value) : undefined })}
                className="input"
              >
                <option value="">选择分类</option>
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label">标签</label>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg min-h-[42px]">
                {allTags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tagIds?.includes(tag.id) || false}
                      onChange={(e) => {
                        const ids = formData.tagIds || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, tagIds: [...ids, tag.id] });
                        } else {
                          setFormData({ ...formData, tagIds: ids.filter(id => id !== tag.id) });
                        }
                      }}
                      className="rounded"
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="label">内容 (Markdown) *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input font-mono"
              rows={12}
              placeholder="# 标题&#10;&#10;内容..."
              required
            />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">立即发布</span>
            </label>
          </div>

          {formData.content && (
            <div className="form-group">
              <label className="label">预览</label>
              <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 prose">
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="btn btn-secondary"
            >
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPost ? '保存修改' : '创建文章'}
            </button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
