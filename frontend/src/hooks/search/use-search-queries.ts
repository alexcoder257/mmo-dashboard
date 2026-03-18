// TODO: implement — stub for build compatibility
import { useQuery } from '@tanstack/react-query';

export const SEARCH_QUERY_KEYS = {
  suggestions: (query: string) => ['search', 'suggestions', query] as const,
};

export const useSearchSuggestionsQuery = (query: string) => {
  return useQuery({
    enabled: query.length > 1,
    queryFn: async (): Promise<{ items: { name: string; sku: string }[] }> => {
      // TODO: implement real search API call
      return { items: [] };
    },
    queryKey: SEARCH_QUERY_KEYS.suggestions(query),
  });
};
