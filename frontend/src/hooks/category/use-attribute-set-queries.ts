// TODO: implement — stub for build compatibility
import { useQuery } from '@tanstack/react-query';

import { fetchAttributeSetApi } from '@/apis/attribute-set.api';

export const ATTRIBUTE_SET_QUERY_KEYS = {
  list: ['attribute-sets', 'list'] as const,
};

export const useAttributeSetQuery = () => {
  return useQuery({
    queryFn: () => fetchAttributeSetApi().then((res) => res.data),
    queryKey: ATTRIBUTE_SET_QUERY_KEYS.list,
  });
};
