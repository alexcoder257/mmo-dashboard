'use client';

export const runtime = 'edge';

import { Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { MainNews, NewsCard, SmallNewsArticles } from '@/components/news';
import { BaseButton } from '@/components/shared/BaseButton';
import { DEFAULT_PAGE_SIZE } from '@/constants/shared.const';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { useArticleListInfiniteQuery } from '@/hooks/articles/use-article-queries';
import { useInfiniteScroll } from '@/hooks/shared/use-infinite-scroll';
import { Link } from '@/i18n/navigation';
import { IArticleItem } from '@/models/interfaces/article.interface';
import { getTimeAgo } from '@/utils/shared.util';

const NewsPage: React.FC = () => {
  const t = useTranslations();

  const [shouldEnableInfiniteScroll, setShouldEnableInfiniteScroll] =
    useState(false);

  const articleInfiniteQuery = useArticleListInfiniteQuery(
    { currentPage: 1, pageSize: DEFAULT_PAGE_SIZE },
    true,
  );

  const allArticles =
    articleInfiniteQuery.data?.pages.flatMap((page) => page.items) || [];

  const { handleLoadMore, targetRef } = useInfiniteScroll({
    fetchNextPage: articleInfiniteQuery.fetchNextPage,
    hasNextPage: articleInfiniteQuery.hasNextPage,
    isFetchingNextPage: articleInfiniteQuery.isFetchingNextPage,
  });

  if (articleInfiniteQuery.isLoading) {
    return (
      <div className="py-4 sm:py-12">
        <Skeleton active />
      </div>
    );
  }

  const mainArticle = allArticles[0];
  const smallArticles = allArticles.slice(1, 3);
  const gridArticles = allArticles.slice(3);

  const handleStartInfiniteScroll = () => {
    setShouldEnableInfiniteScroll(true);
    if (
      articleInfiniteQuery.hasNextPage &&
      !articleInfiniteQuery.isFetchingNextPage
    ) {
      articleInfiniteQuery.fetchNextPage();
    }
  };

  const mapToNewsArticle = (article: IArticleItem) => ({
    author: article.authorName,
    description: article.shortDescription,
    id: String(article.postId),
    image: article.image,
    timeAgo: getTimeAgo(article.publishDate),
    title: article.name,
  });

  return (
    <div className="py-4 sm:py-12 ">
      <div className="flex flex-col items-center gap-12">
        <div className="w-full rounded-2xl p-0 flex flex-col gap-6">
          <div className="flex justify-stretch items-stretch gap-8">
            <h1 className="text-[28px] font-semibold leading-[1.3] text-black font-inter">
              {t('news.latestNews')}
            </h1>
          </div>
          <div className="border-b border-[#DCDCDC] pb-6">
            <div className="flex justify-center gap-6 flex-col sm:flex-row">
              {mainArticle && <MainNews article={mainArticle} />}
              <SmallNewsArticles articles={smallArticles} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articleInfiniteQuery.isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    className="rounded-2xl overflow-hidden bg-white"
                    key={idx}
                  >
                    <Skeleton.Image
                      active
                      className="!w-full !h-[222px] !rounded-2xl mb-4"
                    />
                    <Skeleton active paragraph={{ rows: 2 }} title={false} />
                  </div>
                ))
              : gridArticles.map(
                  (article: IArticleItem, articleIndex: number) => {
                    const mappedArticle = mapToNewsArticle(article);
                    return (
                      <Link
                        href={`/news/${mappedArticle.id}`}
                        key={`${mappedArticle.id}-${articleIndex}`}
                      >
                        <NewsCard article={mappedArticle} />
                      </Link>
                    );
                  },
                )}
            {shouldEnableInfiniteScroll &&
              articleInfiniteQuery.isFetchingNextPage &&
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  className="rounded-2xl overflow-hidden bg-white"
                  key={`infinite-skeleton-${idx}`}
                >
                  <Skeleton.Image
                    active
                    className="!w-full !h-[222px] !rounded-2xl mb-4"
                  />
                  <Skeleton active paragraph={{ rows: 2 }} title={false} />
                </div>
              ))}
          </div>
          {!shouldEnableInfiniteScroll && articleInfiniteQuery.hasNextPage && (
            <div className="flex flex-col justify-center items-center gap-[10px]">
              <BaseButton
                className="!border-[#DCDCDC] !border !rounded-xl !px-8 "
                colorText={DEFAULT_THEME.NEUTRAL_950}
                customColor="transparent"
                onClick={handleStartInfiniteScroll}
                size="middle-large"
                variant="outlined"
              >
                {t('news.viewMore')}
              </BaseButton>
            </div>
          )}
          {shouldEnableInfiniteScroll && articleInfiniteQuery.hasNextPage && (
            <div
              className="flex flex-col justify-center items-center gap-[10px]"
              ref={targetRef}
            >
              <BaseButton
                className="!border-[#DCDCDC] !border !rounded-xl !px-8 "
                colorText={DEFAULT_THEME.NEUTRAL_950}
                customColor="transparent"
                disabled={articleInfiniteQuery.isFetchingNextPage}
                onClick={handleLoadMore}
                size="middle-large"
                variant="outlined"
              >
                {t('news.loading')}
              </BaseButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
