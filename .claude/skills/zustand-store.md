---
name: zustand-store
description: Create Zustand stores following MMO Dashboard conventions (devtools, IState interface, use*Store naming).
metadata:
  {
    "openclaw":
      { "emoji": "🏪", "requires": {}, "primaryEnv": "" },
  }
---

# zustand-store

Create Zustand state stores for the MMO Dashboard project.

## Trigger Phrases

When the user says:
- "create a store", "add a store", "new store", "add state management"
- "zustand store for ...", "global state for ..."

## Conventions

### File Location
- `src/stores/{feature}.store.ts`

### Naming
- Store hook: `use{Feature}Store` (e.g., `useAuthStore`, `useModalStore`)
- State interface: `IState` (local to file)

### Template

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IState {
  // State properties (alphabetical)
  items: IItem[];
  isLoading: boolean;

  // Actions (alphabetical)
  addItem: (item: IItem) => void;
  clearItems: () => void;
  setItems: (items: IItem[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useFeatureStore = create<IState>()(
  devtools((set, get) => ({
    items: [],
    isLoading: false,

    addItem: (item: IItem) =>
      set({ items: [...get().items, item] }),

    clearItems: () => set({ items: [] }),

    setItems: (items: IItem[]) => set({ items }),

    setLoading: (loading: boolean) => set({ isLoading: loading }),
  })),
);
```

### Rules
1. Always wrap with `devtools()` middleware
2. Type the store with `create<IState>()(...)` (double invocation)
3. `IState` interface includes both state properties and action methods
4. Alphabetical ordering for interface members and store properties
5. Import types from `@/models/interfaces/` or `@/models/enums/`
6. For cookie/localStorage persistence, use `js-cookie` or direct `localStorage`
7. Async actions call API functions from `@/apis/` — keep API logic in API files
8. Use `get()` to access current state within actions
9. Use `set()` with partial state object for updates

### Patterns

**With localStorage persistence:**
```typescript
const saved = JSON.parse(localStorage.getItem('key') || '[]');
// Initialize state from saved, set() and sync localStorage in actions
```

**With cookie persistence (auth tokens):**
```typescript
import jsCookie from 'js-cookie';
import { COOKIE_KEYS } from '@/constants/shared.const';
// Read: jsCookie.get(COOKIE_KEYS.KEY)
// Write: jsCookie.set(COOKIE_KEYS.KEY, value, { expires: 1, path: '/', sameSite: 'lax' })
// Remove: jsCookie.remove(COOKIE_KEYS.KEY)
```

**Reset store utility:**
```typescript
import { resetAll } from '@/utils/shared.util';
// Use resetAll(stateCreator) pattern
```
