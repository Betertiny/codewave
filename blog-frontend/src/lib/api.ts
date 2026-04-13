import axios from 'axios';

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

export default api;

// API 方法
export const blogApi = {
  // 获取文章列表
  getPosts: (params?: { page?: number; pageSize?: number; tag?: string; category?: string }) => 
    api.get('/posts', { params }),

  // 获取文章详情
  getPostBySlug: (slug: string) => 
    api.get(`/posts/${slug}`),

  // 获取标签列表
  getTags: () => 
    api.get('/tags'),

  // 获取标签下的文章
  getPostsByTag: (slug: string, params?: { page?: number; pageSize?: number }) => 
    api.get(`/tags/${slug}/posts`, { params }),

  // 获取分类列表
  getCategories: () => 
    api.get('/categories'),

  // 获取分类下的文章
  getPostsByCategory: (slug: string, params?: { page?: number; pageSize?: number }) => 
    api.get(`/categories/${slug}/posts`, { params }),

  // 获取关于页面
  getAbout: () => 
    api.get('/about'),
};
