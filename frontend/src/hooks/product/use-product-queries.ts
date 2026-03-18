// TODO: implement — stub for build compatibility
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { productDetailApi, productListApi } from '@/apis/product.api';
import { IProductFilter, IProductQueryParams } from '@/models/interfaces/product.interface';

export const PRODUCT_QUERY_KEYS = {
  detail: (sku: string) => ['products', 'detail', sku] as const,
  infiniteByCategory: (categoryId: string | undefined, pageSize: number) =>
    ['products', 'infinite', 'category', categoryId, pageSize] as const,
  infiniteWithFilters: (filter: IProductFilter | null | undefined, pageSize: number) =>
    ['products', 'infinite', 'filters', filter, pageSize] as const,
  relateds: (skus: string[]) => ['products', 'relateds', skus] as const,
};

const buildProductQueryParams = (params: IProductQueryParams) => {
  const { currentPage = 1, filter, pageSize = 20 } = params;
  const searchCriteria: Record<string, unknown> = {
    'searchCriteria[currentPage]': currentPage,
    'searchCriteria[pageSize]': pageSize,
  };

  if (filter?.categoryId?.length) {
    searchCriteria['searchCriteria[filterGroups][0][filters][0][field]'] = 'category_id';
    searchCriteria['searchCriteria[filterGroups][0][filters][0][value]'] =
      filter.categoryId.join(',');
    searchCriteria['searchCriteria[filterGroups][0][filters][0][conditionType]'] = 'in';
  }

  return searchCriteria;
};

export const useProductsInfiniteQueryByCategory = (
  categoryId: string | undefined,
  pageSize: number = 20,
) => {
  return useInfiniteQuery({
    enabled: !!categoryId,
    getNextPageParam: (lastPage: Awaited<ReturnType<typeof productListApi>>['data']) => {
      if (!lastPage) return undefined;
      const totalPages = Math.ceil(lastPage.totalCount / pageSize);
      const currentPage = lastPage.searchCriteria.currentPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const params = buildProductQueryParams({
        currentPage: pageParam as number,
        filter: categoryId ? { categoryId: [categoryId] } : undefined,
        pageSize,
      });
      const res = await productListApi(params);
      return res.data;
    },
    queryKey: PRODUCT_QUERY_KEYS.infiniteByCategory(categoryId, pageSize),
  });
};

export const useProductsInfiniteQueryWithFilters = (
  categoryId: string,
  filter: IProductFilter | null | undefined,
  enabled: boolean = true,
  pageSize: number = 20,
) => {
  return useInfiniteQuery({
    enabled,
    getNextPageParam: (lastPage: Awaited<ReturnType<typeof productListApi>>['data']) => {
      if (!lastPage) return undefined;
      const totalPages = Math.ceil(lastPage.totalCount / pageSize);
      const currentPage = lastPage.searchCriteria.currentPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const combinedFilter: IProductFilter = {
        ...(filter ?? {}),
        categoryId: categoryId ? [categoryId] : undefined,
      };
      const params = buildProductQueryParams({
        currentPage: pageParam as number,
        filter: combinedFilter,
        pageSize,
      });
      const res = await productListApi(params);
      return res.data;
    },
    queryKey: PRODUCT_QUERY_KEYS.infiniteWithFilters(filter, pageSize),
  });
};

export const useProductDetail = (sku: string) => {
  return useQuery({
    enabled: !!sku,
    queryFn: () => productDetailApi(sku).then((res) => res.data),
    queryKey: PRODUCT_QUERY_KEYS.detail(sku),
  });
};

export const useProductRelateds = (skus: string[]) => {
  return useQuery({
    enabled: skus.length > 0,
    queryFn: async () => {
      const results = await Promise.all(skus.map((sku) => productDetailApi(sku)));
      return results.map((r) => r.data);
    },
    queryKey: PRODUCT_QUERY_KEYS.relateds(skus),
  });
};
