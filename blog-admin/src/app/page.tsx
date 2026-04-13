'use client';

import { useEffect, useState } from 'react';
import { postsApi, categoriesApi, tagsApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { 
  FileText, 
  Eye, 
  TrendingUp, 
  Clock,
  Calendar,
  Tag,
  FolderTree,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface Stats {
  totalPosts: number;
  totalViews: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalTags: number;
  recentPosts: Array<{
    id: number;
    title: string;
    slug: string;
    viewCount: number;
    published: boolean;
    createdAt: string;
  }>;
  topPosts: Array<{
    id: number;
    title: string;
    slug: string;
    viewCount: number;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      // Fetch all posts
      const postsRes = await postsApi.getPosts({ pageSize: 100 });
      const posts = postsRes.data || [];
      
      // Fetch categories and tags
      const [categoriesRes, tagsRes] = await Promise.all([
        categoriesApi.getCategories(),
        tagsApi.getTags()
      ]);
      
      const categories = categoriesRes.data || [];
      const tags = tagsRes.data || [];
      
      // Calculate stats
      const totalPosts = posts.length;
      const publishedPosts = posts.filter((p: any) => p.published).length;
      const draftPosts = totalPosts - publishedPosts;
      const totalViews = posts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);
      
      // Get recent posts (last 5)
      const recentPosts = [...posts]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      // Get top posts by views
      const topPosts = [...posts]
        .filter((p: any) => p.viewCount > 0)
        .sort((a: any, b: any) => b.viewCount - a.viewCount)
        .slice(0, 5);

      setStats({
        totalPosts,
        totalViews,
        publishedPosts,
        draftPosts,
        totalCategories: categories.length,
        totalTags: tags.length,
        recentPosts,
        topPosts
      });
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subtext,
    gradient 
  }: { 
    icon: any; 
    label: string; 
    value: string | number;
    subtext?: string;
    gradient: string;
  }) => (
    <div className="card p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">仪表盘</h1>
          <p className="text-gray-500 text-sm mt-1">博客数据概览</p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="btn btn-secondary"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? '刷新中...' : '刷新'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="文章总数"
          value={stats?.totalPosts || 0}
          subtext={`${stats?.draftPosts || 0} 篇草稿`}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Eye}
          label="总浏览量"
          value={stats?.totalViews?.toLocaleString() || 0}
          subtext="所有文章累计"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="已发布"
          value={stats?.publishedPosts || 0}
          subtext={`${((stats?.publishedPosts || 0) / (stats?.totalPosts || 1) * 100).toFixed(0)}% 发布率`}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          icon={FolderTree}
          label="分类"
          value={stats?.totalCategories || 0}
          subtext={`${stats?.totalTags || 0} 个标签`}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts by Views */}
        <div className="card">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              热门文章
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.topPosts && stats.topPosts.length > 0 ? (
              stats.topPosts.map((post, index) => (
                <div key={post.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-sm text-gray-500">{post.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.viewCount}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                暂无浏览数据
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="card">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              最新文章
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.recentPosts && stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post) => (
                <div key={post.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {formatDateTime(post.createdAt)}
                    </p>
                  </div>
                  <span className={`badge ${post.published ? 'badge-success' : 'badge-draft'}`}>
                    {post.published ? '已发布' : '草稿'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                暂无文章
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
