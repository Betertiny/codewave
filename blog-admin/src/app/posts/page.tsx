'use client';

import { useEffect, useState } from 'react';
import { postsApi, tagsApi, categoriesApi } from '@/lib/api';
import type { Post, Tag, Category, CreatePostDto } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Modal } from '@/components/Modal';
import { Toast, useToast } from '@/components/Toast';
import { Loading } from '@/components/Loading';
import ImageUpload from '@/components/ImageUpload';
import { 
  Plus, Pencil, Trash2, Eye, EyeOff, Search, FileText, 
  RotateCcw, Trash, CheckSquare, Square, AlertTriangle, Clock,
  Calendar, X, Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { logOperation } from '@/store/auth';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [deletedPosts, setDeletedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    published: false,
    scheduledAt: undefined,
    categoryId: undefined,
    tagIds: [],
  });

  useEffect(() => {
    fetchPosts();
    fetchDeletedPosts();
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

  const fetchDeletedPosts = async () => {
    try {
      const res = await postsApi.getDeletedPosts();
      setDeletedPosts(res.data || []);
    } catch (error) {
      console.error('获取回收站失败:', error);
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
      fetchDeletedPosts();
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
      scheduledAt: post.scheduledAt || undefined,
      categoryId: post.categoryId,
      tagIds: post.tags?.map(t => t.id) || [],
    });
    setIsModalOpen(true);
  };

  // 软删除 - 移入回收站
  const handleSoftDelete = async (id: number) => {
    if (!confirm('确定要将文章移入回收站吗？')) return;
    try {
      await postsApi.softDeletePost(id);
      logOperation('移入回收站', '文章', id.toString());
      showToast('已移入回收站', 'success');
      fetchPosts();
      fetchDeletedPosts();
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
    }
  };

  // 批量软删除
  const handleBatchSoftDelete = async () => {
    if (selectedPosts.length === 0) return;
    if (!confirm(`确定要将 ${selectedPosts.length} 篇文章移入回收站吗？`)) return;
    try {
      await Promise.all(selectedPosts.map(id => postsApi.softDeletePost(id)));
      logOperation('批量移入回收站', '文章', selectedPosts.join(','), `${selectedPosts.length} 篇`);
      showToast(`已移入回收站`, 'success');
      setSelectedPosts([]);
      fetchPosts();
      fetchDeletedPosts();
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
    }
  };

  // 恢复文章
  const handleRestore = async (id: number) => {
    try {
      await postsApi.restorePost(id);
      logOperation('恢复', '文章', id.toString());
      showToast('文章已恢复', 'success');
      fetchPosts();
      fetchDeletedPosts();
    } catch (error: any) {
      showToast(error.message || '恢复失败', 'error');
    }
  };

  // 批量恢复
  const handleBatchRestore = async () => {
    if (selectedPosts.length === 0) return;
    if (!confirm(`确定要恢复 ${selectedPosts.length} 篇文章吗？`)) return;
    try {
      await Promise.all(selectedPosts.map(id => postsApi.restorePost(id)));
      logOperation('批量恢复', '文章', selectedPosts.join(','), `${selectedPosts.length} 篇`);
      showToast(`已恢复`, 'success');
      setSelectedPosts([]);
      fetchPosts();
      fetchDeletedPosts();
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
    }
  };

  // 彻底删除
  const handlePermanentDelete = async (id: number) => {
    if (!confirm('警告：此操作不可恢复！确定要永久删除吗？')) return;
    try {
      await postsApi.deletePost(id);
      logOperation('永久删除', '文章', id.toString());
      showToast('已永久删除', 'success');
      fetchPosts();
      fetchDeletedPosts();
    } catch (error: any) {
      showToast(error.message || '删除失败', 'error');
    }
  };

  // 清空回收站
  const handleClearRecycleBin = async () => {
    if (!confirm('警告：此操作将永久删除回收站中的所有文章！确定继续吗？')) return;
    try {
      const res = await postsApi.clearRecycleBin();
      logOperation('清空回收站', '文章', undefined, `删除了 ${res.count} 篇`);
      showToast(`已清空回收站，删除了 ${res.count} 篇文章`, 'success');
      fetchDeletedPosts();
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
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
      scheduledAt: undefined,
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

  const toggleSelectPost = (id: number) => {
    setSelectedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentList = showRecycleBin ? deletedPosts : posts;
    if (selectedPosts.length === currentList.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(currentList.map(p => p.id));
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeleted = deletedPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 格式化定时发布时间
  const formatScheduledTime = (scheduledAt: string | null | undefined) => {
    if (!scheduledAt) return null;
    const date = new Date(scheduledAt);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">{showRecycleBin ? '回收站' : '文章管理'}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {showRecycleBin 
              ? `共 ${deletedPosts.length} 篇已删除文章`
              : `共 ${posts.length} 篇文章`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowRecycleBin(!showRecycleBin); setSelectedPosts([]); }}
            className={`btn ${showRecycleBin ? 'btn-secondary' : 'btn-outline'}`}
          >
            <Trash className="w-4 h-4" />
            {showRecycleBin ? '返回文章列表' : '回收站'}
            {deletedPosts.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-xs">
                {deletedPosts.length}
              </span>
            )}
          </button>
          {!showRecycleBin && (
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              新建文章
            </button>
          )}
        </div>
      </div>

      {/* Search & Actions */}
      <div className="card p-4 mb-5">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={showRecycleBin ? "搜索回收站..." : "搜索文章..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">已选择 {selectedPosts.length} 篇</span>
              {showRecycleBin ? (
                <>
                  <button onClick={handleBatchRestore} className="btn btn-sm btn-primary">
                    <RotateCcw className="w-4 h-4" /> 恢复
                  </button>
                  <button onClick={handleClearRecycleBin} className="btn btn-sm btn-danger">
                    <Trash className="w-4 h-4" /> 清空
                  </button>
                </>
              ) : (
                <button onClick={handleBatchSoftDelete} className="btn btn-sm btn-danger">
                  <Trash className="w-4 h-4" /> 批量删除
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-10">
                <button 
                  onClick={toggleSelectAll}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {selectedPosts.length === (showRecycleBin ? deletedPosts.length : posts.length) && 
                   selectedPosts.length > 0 ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </th>
              <th>标题</th>
              <th>Slug</th>
              <th>状态</th>
              <th>分类</th>
              {showRecycleBin ? <th>删除时间</th> : <th>更新时间</th>}
              <th className="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {(showRecycleBin ? filteredDeleted : filteredPosts).map((post) => (
              <tr key={post.id} className={selectedPosts.includes(post.id) ? 'bg-blue-50' : ''}>
                <td>
                  <button 
                    onClick={() => toggleSelectPost(post.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {selectedPosts.includes(post.id) ? (
                      <CheckSquare className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</p>
                      )}
                      {post.scheduledAt && !post.published && (
                        <p className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          定时发布: {formatScheduledTime(post.scheduledAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-gray-500 font-mono">{post.slug}</span>
                </td>
                <td>
                  {showRecycleBin ? (
                    <span className="badge badge-draft">已删除</span>
                  ) : (
                    <>
                      <span className={`badge ${post.published ? 'badge-success' : 'badge-draft'}`}>
                        {post.published ? '已发布' : '草稿'}
                      </span>
                      {post.viewCount > 0 && (
                        <span className="ml-2 text-xs text-gray-400 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {post.viewCount}
                        </span>
                      )}
                    </>
                  )}
                </td>
                <td>
                  {post.category ? (
                    <span className="badge badge-primary">{post.category.name}</span>
                  ) : (
                    <span className="text-gray-400 text-sm">未分类</span>
                  )}
                </td>
                <td>
                  <span className="text-sm text-gray-500">
                    {formatDateTime(showRecycleBin ? post.deletedAt! : post.updatedAt)}
                  </span>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    {showRecycleBin ? (
                      <>
                        <button
                          onClick={() => handleRestore(post.id)}
                          className="btn btn-icon text-green-600 hover:bg-green-50"
                          title="恢复"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(post.id)}
                          className="btn btn-icon text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="永久删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
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
                          onClick={() => handleSoftDelete(post.id)}
                          className="btn btn-icon text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {(showRecycleBin ? filteredDeleted : filteredPosts).length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  {showRecycleBin ? '回收站为空' : '暂无文章，点击右上角新建'}
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
            <label className="label">封面图片</label>
            <ImageUpload
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
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

          {/* 发布设置 */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">立即发布</span>
            </label>
            
            {!formData.published && (
              <div className="form-group mb-0">
                <label className="label flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  定时发布
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    scheduledAt: e.target.value || undefined,
                    published: false 
                  })}
                  className="input"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  设置发布时间后，文章将在指定时间自动发布
                </p>
              </div>
            )}
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
