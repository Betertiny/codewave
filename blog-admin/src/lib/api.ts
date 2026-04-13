import axios from 'axios';
import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  Tag,
  CreateTagDto,
  UpdateTagDto,
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  About,
  PaginatedResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

// ============ 文章 API ============
export const postsApi = {
  // 获取文章列表
  getPosts: async (params?: { page?: number; pageSize?: number }): Promise<PaginatedResponse<Post>> => {
    return api.get('/posts', { params });
  },

  // 获取文章详情
  getPost: async (slug: string): Promise<Post> => {
    return api.get(`/posts/${slug}`);
  },

  // 创建文章
  createPost: async (data: CreatePostDto): Promise<Post> => {
    return api.post('/posts', data);
  },

  // 更新文章
  updatePost: async (id: number, data: UpdatePostDto): Promise<Post> => {
    return api.patch(`/posts/${id}`, data);
  },

  // 软删除文章 (移入回收站)
  softDeletePost: async (id: number): Promise<void> => {
    return api.post(`/posts/${id}/soft-delete`);
  },

  // 恢复文章
  restorePost: async (id: number): Promise<Post> => {
    return api.post(`/posts/${id}/restore`);
  },

  // 获取回收站文章列表
  getDeletedPosts: async (): Promise<{ data: Post[] }> => {
    return api.get('/posts/deleted');
  },

  // 清空回收站
  clearRecycleBin: async (): Promise<{ count: number }> => {
    return api.delete('/posts/deleted/all');
  },

  // 永久删除文章
  deletePost: async (id: number): Promise<void> => {
    return api.delete(`/posts/${id}`);
  },
};

// ============ 标签 API ============
export const tagsApi = {
  // 获取标签列表
  getTags: async (): Promise<{ data: Tag[] }> => {
    return api.get('/tags');
  },

  // 创建标签
  createTag: async (data: CreateTagDto): Promise<Tag> => {
    return api.post('/tags', data);
  },

  // 更新标签
  updateTag: async (id: number, data: UpdateTagDto): Promise<Tag> => {
    return api.patch(`/tags/${id}`, data);
  },

  // 删除标签
  deleteTag: async (id: number): Promise<void> => {
    return api.delete(`/tags/${id}`);
  },
};

// ============ 分类 API ============
export const categoriesApi = {
  // 获取分类列表
  getCategories: async (): Promise<{ data: Category[] }> => {
    return api.get('/categories');
  },

  // 创建分类
  createCategory: async (data: CreateCategoryDto): Promise<Category> => {
    return api.post('/categories', data);
  },

  // 更新分类
  updateCategory: async (id: number, data: UpdateCategoryDto): Promise<Category> => {
    return api.patch(`/categories/${id}`, data);
  },

  // 删除分类
  deleteCategory: async (id: number): Promise<void> => {
    return api.delete(`/categories/${id}`);
  },
};

// ============ 关于页面 API ============
export const aboutApi = {
  // 获取关于页面
  getAbout: async (): Promise<About> => {
    return api.get('/about');
  },

  // 更新关于页面
  updateAbout: async (data: Partial<About>): Promise<About> => {
    return api.put('/about', data);
  },
};

export default api;
