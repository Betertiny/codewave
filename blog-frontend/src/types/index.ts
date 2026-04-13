// 文章类型
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

// 标签类型
export interface Tag {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

// 关于页面类型
export interface About {
  id: number;
  title: string;
  content: string;
  avatar?: string;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
