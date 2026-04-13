export class Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  viewCount: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: any[];
}

export class PaginatedPosts {
  data: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
