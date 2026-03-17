'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { NewsCard } from '@/components/news/NewsCard';
import { BaseButton } from '@/components/shared/BaseButton';
import { BLOG_PAGE } from '@/constants/route-pages.const';
import { useRouter } from '@/i18n/navigation';

interface BlogDetailPageProps {
  params: {
    blogId: string;
  };
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ params }) => {
  const t = useTranslations();
  const router = useRouter();
  const { blogId } = params;

  // Mock blog post data - in real app, this would come from API
  const mockBlogPost = {
    author: 'John Doe',
    category: 'tech-news',
    content: `
      <h2>Introduction</h2>
      <p>Artificial intelligence is rapidly transforming the consumer technology landscape, bringing unprecedented capabilities to everyday devices and applications. From smartphones to smart homes, AI is becoming an integral part of our daily lives.</p>
      
      <h2>Current Applications</h2>
      <p>Today's consumer devices leverage AI in numerous ways:</p>
      <ul>
        <li>Voice assistants like Siri, Alexa, and Google Assistant</li>
        <li>Smart camera features for enhanced photography</li>
        <li>Predictive text and personalized recommendations</li>
        <li>Health monitoring and fitness tracking</li>
      </ul>
      
      <h2>Future Implications</h2>
      <p>As AI technology continues to advance, we can expect even more sophisticated applications in consumer devices. The future promises more intuitive interfaces, better personalization, and seamless integration across all our devices.</p>
      
      <h2>Challenges and Considerations</h2>
      <p>While AI brings many benefits, it also raises important questions about privacy, security, and ethical use of technology. As consumers, it's important to stay informed about how our data is being used and what safeguards are in place.</p>
      
      <h2>Conclusion</h2>
      <p>The integration of AI into consumer technology is not just a trend—it's a fundamental shift in how we interact with our devices. As these technologies continue to evolve, they will reshape our daily experiences in ways we're only beginning to imagine.</p>
    `,
    date: '2025-01-15',
    id: blogId,
    image: '/images/blog/ai-future.jpg',
    readTime: 5,
    title: t('blog.posts.post1.title'),
  };

  // Mock related posts
  const relatedPosts = [
    {
      author: 'Tech Team',
      description: t('blog.posts.post2.description'),
      id: '2',
      image: '/images/blog/post2.jpg',
      timeAgo: '2 days ago',
      title: t('blog.posts.post2.title'),
    },
    {
      author: 'Tech Team',
      description:
        'Discover the most innovative AI applications that are changing how we work and play.',
      id: '3',
      image: '/images/blog/post3.jpg',
      timeAgo: '3 days ago',
      title: 'Top 10 AI-Powered Apps for 2025',
    },
    {
      author: 'Tech Team',
      description:
        'A beginner-friendly guide to the fundamentals of machine learning and its applications.',
      id: '4',
      image: '/images/blog/post4.jpg',
      timeAgo: '1 week ago',
      title: 'Understanding Machine Learning Basics',
    },
  ];

  if (!mockBlogPost) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockBlogPost.title,
        url: window.location.href,
      });
    }
  };

  const _handleRelatedPostClick = (postId: string) => {
    router.push(BLOG_PAGE.DETAIL.replace('{id}', postId));
  };

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{mockBlogPost.title}</h1>
        <div className="flex items-center justify-between text-gray-600 mb-6">
          <div className="flex items-center gap-4">
            <span>
              {t('blog.detail.author', { author: mockBlogPost.author })}
            </span>
            <span>{'•'}</span>
            <span>
              {t('blog.detail.date', { date: formatDate(mockBlogPost.date) })}
            </span>
            <span>{'•'}</span>
            <span>
              {t('blog.detail.readTime', { minutes: mockBlogPost.readTime })}
            </span>
          </div>
          <BaseButton onClick={handleShare} size="small" variant="outlined">
            {t('blog.detail.share')}
          </BaseButton>
        </div>
      </header>

      {/* Featured Image */}
      {mockBlogPost.image && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            alt={mockBlogPost.title}
            className="object-cover"
            fill
            priority
            src={mockBlogPost.image}
          />
        </div>
      )}

      {/* Article Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: mockBlogPost.content }}
      />

      {/* Related Posts */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">
          {t('blog.detail.relatedPosts')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <NewsCard article={post} key={post.id} />
          ))}
        </div>
      </section>
    </article>
  );
};

export default BlogDetailPage;
