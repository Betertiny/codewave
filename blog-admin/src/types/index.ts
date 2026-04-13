// 文章相关类型
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  published: boolean;
  categoryId?: number;
  category?: Category;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  categoryId?: number;
  tagIds?: number[];
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

// 标签相关类型
export interface Tag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  createdAt: string;
}

export interface CreateTagDto {
  name: string;
  slug: string;
  color?: string;
}

export interface UpdateTagDto extends Partial<CreateTagDto> {}

// 分类相关类型
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

// 关于页面类型
export interface About {
  title?: string;
  content?: string;
  avatar?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    email?: string;
  };
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
