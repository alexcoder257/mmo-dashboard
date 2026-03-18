// TODO: implement — stub for build compatibility
import { useQuery } from '@tanstack/react-query';

import { categoryListApi } from '@/apis/category.api';
import { ICategoryListParams } from '@/models/interfaces/category.interface';

export const CATEGORY_QUERY_KEYS = {
  list: (params: ICategoryListParams) => ['categories', 'list', params] as const,
};

export const useCategoryListQuery = (params: ICategoryListParams = {}) => {
  return useQuery({
    queryFn: () => categoryListApi(params).then((res) => res.data),
    queryKey: CATEGORY_QUERY_KEYS.list(params),
  });
};
