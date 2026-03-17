---
name: api-service
description: Create API service functions following MMO Dashboard conventions (custom fetch wrapper, *Api suffix, route constants).
metadata:
  {
    "openclaw":
      { "emoji": "🔌", "requires": {}, "primaryEnv": "" },
  }
---

# api-service

Create API service files for the MMO Dashboard project.

## Trigger Phrases

When the user says:
- "create an API", "add API endpoint", "new API service"
- "add an api for ...", "connect to backend ...", "fetch data from ..."

## Conventions

### File Locations
- API functions: `src/apis/{feature}.api.ts`
- Route constants: `src/constants/route-apis.const.ts`
- Request/response types: `src/models/interfaces/{feature}.interface.ts`

### Naming
- Functions: `{feature}{Action}Api` (e.g., `productListApi`, `authLoginApi`)
- Route constant groups: `{FEATURE}_API` (e.g., `AUTH_API`, `PRODUCT_API`)

### Template — API Service

```typescript
import type { IFeatureResponse, IFeatureRequest } from '@/models/interfaces/feature.interface';

import { FEATURE_API } from '@/constants/route-apis.const';
import { get, post, put, del } from '@/libs/fetch/utils';

export const featureListApi = async (params?: Record<string, unknown>) => {
  const url = FEATURE_API.LIST;
  return await get<IFeatureResponse[]>(url, { params });
};

export const featureDetailApi = async (id: string) => {
  const url = FEATURE_API.DETAIL(id);
  return await get<IFeatureResponse>(url);
};

export const featureCreateApi = async (data: IFeatureRequest) => {
  const url = FEATURE_API.CREATE;
  return await post<IFeatureResponse>(
    url,
    data,
    undefined,       // config overrides
    undefined,       // loading target
    'Created successfully', // toast message
  );
};

export const featureUpdateApi = async (id: string, data: IFeatureRequest) => {
  const url = FEATURE_API.UPDATE(id);
  return await put<IFeatureResponse>(url, data);
};

export const featureDeleteApi = async (id: string) => {
  const url = FEATURE_API.DELETE(id);
  return await del<void>(url);
};
```

### Template — Route Constants

```typescript
// Add to src/constants/route-apis.const.ts
export const FEATURE_API = {
  CREATE: '/rest/V1/feature',
  DELETE: (id: string) => `/rest/V1/feature/${id}`,
  DETAIL: (id: string) => `/rest/V1/feature/${id}`,
  LIST: '/rest/V1/feature',
  UPDATE: (id: string) => `/rest/V1/feature/${id}`,
};
```

### Rules
1. Import HTTP methods from `@/libs/fetch/utils` (`get`, `post`, `put`, `patch`, `del`)
2. Define URL constants in `route-apis.const.ts`, not inline
3. Type imports use `import type { ... }` syntax
4. Body auto-converts camelCase → snake_case (handled by fetch interceptor)
5. Response auto-converts snake_case → camelCase (handled by fetch interceptor)
6. Pass `{ credentials: 'include' }` for auth-related requests
7. Toast messages as 5th argument to `post`/`put` for success notifications
8. Loading targets as 4th argument (CSS selector string or `'fullscreen'`)
9. Each function is `async` and returns the fetch wrapper result
10. Alphabetical ordering for exports
