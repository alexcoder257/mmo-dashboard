---
name: nextjs-component
description: Create Next.js components following MMO Dashboard conventions (Base* prefix, Ant Design, Tailwind, TypeScript).
metadata:
  {
    "openclaw":
      { "emoji": "🧩", "requires": {}, "primaryEnv": "" },
  }
---

# nextjs-component

Create React components for the MMO Dashboard project following established conventions.

## Trigger Phrases

When the user says:
- "create a component", "add a component", "new component"
- "make a Base*", "build a widget", "add a shared component"

## Conventions

### File Location
- **Shared/reusable:** `src/components/shared/Base*.tsx`
- **Feature-specific:** `src/components/{featureName}/ComponentName.tsx`
- **Page component:** `src/app/[locale]/(main)/{route}/page.tsx`

### Naming
- Shared components use `Base*` prefix: `BaseButton`, `BaseInput`, `BaseModal`
- Feature components use PascalCase: `ProductCard`, `ChatMessage`
- Props interface: `IProps` (extends Ant Design props when wrapping)

### Template — Shared Component

```typescript
import { clsx } from 'clsx';

interface IProps {
  children?: React.ReactNode;
  className?: string;
  // custom props...
}

export const BaseComponentName: React.FC<IProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div className={clsx('base-styles', className)}>
      {children}
    </div>
  );
};
```

### Template — Page Component

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function FeaturePage() {
  const t = useTranslations('feature');

  return (
    <div>
      {t('title')}
    </div>
  );
}
```

### Rules
1. Use `clsx` for conditional class names
2. Use Tailwind CSS for styling (with `!` prefix for Ant Design overrides)
3. Use `useTranslations` for all user-facing text (no string literals in JSX)
4. Props interface named `IProps`, extending Ant Design types when wrapping
5. Export as named export (not default) for shared components
6. Export as default for page components
7. SVG icons imported from `@/assets/icons/` as React components
8. Use `React.FC<IProps>` for component typing
9. Alphabetical ordering for imports, props, and interface members
