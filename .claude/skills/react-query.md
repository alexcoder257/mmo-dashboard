---
name: react-query
description: Create TanStack React Query hooks following MMO Dashboard conventions (query keys, custom hooks, API integration).
metadata:
  {
    "openclaw":
      { "emoji": "🔄", "requires": {}, "primaryEnv": "" },
  }
---

# react-query

Create React Query hooks for data fetching in the MMO Dashboard project.

## Trigger Phrases

When the user says:
- "add data fetching", "create a query hook", "react query for ..."
- "fetch and cache ...", "add a mutation", "server state for ..."

## Conventions

### Provider
- `ReactQueryProvider` at `src/contexts/ReactQueryProvider.tsx`
- Default `staleTime`: 60 seconds

### Template — Query Hook

```typescript
import { useQuery } from '@tanstack/react-query';

import { featureListApi } from '@/apis/feature.api';

export const FEATURE_QUERY_KEYS = {
  all: ['features'] as const,
  detail: (id: string) => ['features', id] as const,
  list: (params?: Record<string, unknown>) => ['features', 'list', params] as const,
};

export const useFeatureList = (params?: Record<string, unknown>) => {
  return useQuery({
    queryFn: () => featureListApi(params),
    queryKey: FEATURE_QUERY_KEYS.list(params),
  });
};

export const useFeatureDetail = (id: string) => {
  return useQuery({
    enabled: Boolean(id),
    queryFn: () => featureDetailApi(id),
    queryKey: FEATURE_QUERY_KEYS.detail(id),
  });
};
```

### Template — Mutation Hook

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { featureCreateApi } from '@/apis/feature.api';

export const useFeatureCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: featureCreateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEATURE_QUERY_KEYS.all });
    },
  });
};
```

### Rules
1. Query keys: use `as const` tuple pattern for type safety
2. Query key hierarchy: `all` → `list(params)` → `detail(id)`
3. API functions from `@/apis/` — don't inline fetch logic
4. Use `enabled` option to conditionally run queries
5. Invalidate relevant queries on mutation success
6. Alphabetical ordering for hook options
