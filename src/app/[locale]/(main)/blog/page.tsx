'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { NewsCard } from '@/components/news/NewsCard';
import { BaseButton } from '@/components/shared/BaseButton';
import { BasePagination } from '@/components/shared/BasePagination';
import { BLOG_PAGE } from '@/constants/route-pages.const';
import { useRouter } from '@/i18n/navigation';

const BlogPage: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock blog data - in real app, this would come from API
  const categories = [
    { id: 'all', name: t('blog.categories.all') },
    { id: 'tech-news', name: t('blog.categories.techNews') },
    { id: 'reviews', name: t('blog.categories.reviews') },
    { id: 'guides', name: t('blog.categories.guides') },
    { id: 'industry', name: t('blog.categories.industry') },
  ];

  const mockBlogPosts = [
    {
      author: 'John Doe',
      category: 'tech-news',
      date: '2025-01-15',
      description: t('blog.posts.post1.description'),
      id: '1',
      image: '/images/blog/post1.jpg',
      timeAgo: '1 day ago',
      title: t('blog.posts.post1.title'),
    },
    {
      author: 'Jane Smith',
      category: 'reviews',
      date: '2025-01-14',
      description: t('blog.posts.post2.description'),
      id: '2',
      image: '/images/blog/post2.jpg',
      timeAgo: '2 days ago',
      title: t('blog.posts.post2.title'),
    },
    // Add more mock posts as needed
  ];

  const filteredPosts = mockBlogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const postsPerPage = 9;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const _handlePostClick = (postId: string) => {
    router.push(BLOG_PAGE.DETAIL.replace('{id}', postId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t('blog.title')}</h1>
        <p className="text-lg text-gray-600">{t('blog.subtitle')}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_500"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('blog.searchPlaceholder')}
          type="text"
          value={searchQuery}
        />
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <BaseButton
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setCurrentPage(1);
            }}
            size="small"
            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
          >
            {category.name}
          </BaseButton>
        ))}
      </div>

      {/* Blog Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedPosts.map((post) => (
              <NewsCard article={post} key={post.id} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <BasePagination
                current={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('blog.noPosts')}</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
