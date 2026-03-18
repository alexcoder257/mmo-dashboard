// TODO: implement — stub for build compatibility
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchArticlesApi } from '@/apis/article.api';
import { IArticleQueryParams } from '@/models/interfaces/article.interface';

export const ARTICLE_QUERY_KEYS = {
  list: (params: IArticleQueryParams) => ['articles', 'list', params] as const,
};

export const useArticleListInfiniteQuery = (
  params: IArticleQueryParams = { currentPage: 1, pageSize: 10 },
  _enabled: boolean = true,
) => {
  return useInfiniteQuery({
    getNextPageParam: (lastPage: Awaited<ReturnType<typeof fetchArticlesApi>>) => {
      if (lastPage.pageInfo.hasNextPage) {
        return lastPage.pageInfo.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: params.currentPage ?? 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchArticlesApi(params.pageSize, pageParam as number),
    queryKey: ARTICLE_QUERY_KEYS.list(params),
  });
};
