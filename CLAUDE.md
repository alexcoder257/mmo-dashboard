# MMO Dashboard

Monorepo with `frontend/` (Next.js) and `backend/` (Python FastAPI).

## Skills

- `.claude/skills/nextjs-component.md` — Create Next.js components (Base* prefix, Ant Design, Tailwind, TypeScript)
- `.claude/skills/zustand-store.md` — Create Zustand stores (devtools, IState, use*Store)
- `.claude/skills/api-service.md` — Create API service functions (fetch wrapper, *Api suffix, route constants)
- `.claude/skills/form-schema.md` — Create React Hook Form + Yup validation schemas
- `.claude/skills/react-query.md` — Create TanStack React Query hooks (query keys, mutations)
- `.claude/skills/i18n-locale.md` — Add i18n translations (next-intl, en/vi/ja)
- `.claude/skills/analyze-travel-video.md` — Analyze travel videos → Vietnamese tour guide in Notion (auto #N tagging, under Travel group)

## Frontend Stack

- **Framework:** Next.js 14 (App Router, Edge Runtime)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3 + SCSS + Ant Design 5
- **State:** Zustand 5 (with devtools middleware)
- **Forms:** React Hook Form 7 + Yup + `@hookform/resolvers`
- **Server state:** TanStack React Query 5
- **i18n:** next-intl (locales: en, vi, ja)
- **Deployment:** Cloudflare Pages (wrangler)
- **Package manager:** pnpm 10

## Backend Stack

- **Framework:** Python FastAPI
- **Deployment:** Docker
- **Database:** PostgreSQL

## Project Structure

```
mmo-dashboard/
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── @types/          # Global type declarations
│   │   ├── apis/            # API service functions (*Api suffix)
│   │   ├── app/[locale]/    # Next.js App Router pages
│   │   │   ├── (auth)/      # Auth routes (login, register, etc.)
│   │   │   ├── (main)/      # Main app routes
│   │   │   └── (error)/     # Error pages (404, 403)
│   │   ├── assets/          # fonts/, icons/, images/, styles/
│   │   ├── components/
│   │   │   └── shared/      # Reusable Base* components
│   │   ├── constants/       # UPPER_SNAKE_CASE constants
│   │   ├── contexts/        # React context providers
│   │   ├── i18n/            # Internationalization config
│   │   ├── layouts/         # Layout components
│   │   ├── libs/
│   │   │   ├── fetch/       # Custom fetch wrapper (interceptors, camelCase/snake_case)
│   │   │   └── tailwindcss/ # Theme extensions & custom components
│   │   ├── mocks/           # Mock data
│   │   ├── models/
│   │   │   ├── enums/       # E* prefix enums
│   │   │   ├── interfaces/  # I* prefix interfaces
│   │   │   └── types/       # T* prefix types
│   │   ├── schemas/         # Yup validation schemas
│   │   ├── stores/          # Zustand stores (use*Store)
│   │   ├── utils/           # Utility functions (*Util suffix)
│   │   └── middleware.ts    # Route guards + i18n middleware
│   ├── locales/             # i18n translation files
│   ├── public/              # Static assets
│   ├── package.json
│   └── ...config files
├── backend/                 # Python FastAPI application
│   ├── app/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── .claude/                 # Claude Code skills
├── .gitignore
└── CLAUDE.md
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | `Base*` prefix, PascalCase | `BaseButton`, `BaseInput` |
| Stores | `use*Store` | `useAuthStore`, `useModalStore` |
| API functions | `*Api` suffix | `authLoginApi`, `productListApi` |
| Interfaces | `I*` prefix | `IProduct`, `IAuthUserInfo` |
| Types | `T*` prefix | `TSuccessResponse`, `TObjectUnknown` |
| Enums | `E*` prefix | `EAuthRole`, `ELanguageCode` |
| Constants | `UPPER_SNAKE_CASE` | `COOKIE_KEYS`, `MODAL_KEYS` |
| Files - utils | kebab-case with `.util.ts` | `shared.util.ts` |
| Files - APIs | kebab-case with `.api.ts` | `auth.api.ts` |
| Files - stores | kebab-case with `.store.ts` | `auth.store.ts` |
| Files - schemas | kebab-case with `.schema.ts` | `auth.schema.ts` |
| Files - enums | kebab-case with `.enum.ts` | `auth.enum.ts` |
| Files - interfaces | kebab-case with `.interface.ts` | `auth.interface.ts` |

## Key Patterns

### Zustand Store

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IState {
  // State properties first (alphabetical)
  someValue: string;
  // Action methods (alphabetical)
  setSomeValue: (value: string) => void;
}

export const useSomeStore = create<IState>()(
  devtools((set, get) => ({
    someValue: '',
    setSomeValue: (value: string) => set({ someValue: value }),
  })),
);
```

### API Service

```typescript
import { API_CONST } from '@/constants/route-apis.const';
import { get, post } from '@/libs/fetch/utils';

export const featureListApi = async (params?: IParams) => {
  const url = API_CONST.LIST;
  return await get<IResponse>(url, { params });
};
```

### Yup Schema

```typescript
import { object as yupObject, ref as yupRef, string as yupString } from 'yup';
import { REGEXES } from '@/constants/shared.const';

export const featureSchema = yupObject({
  fieldName: yupString().required('Error message'),
});
```

### React Hook Form Usage

```typescript
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const form = useForm({ resolver: yupResolver(schema) });
```

### Component Props Interface

```typescript
interface IProps extends Omit<AntdProps, 'overridden'> {
  children?: React.ReactNode;
  className?: string;
  // ... custom props
}

export const BaseComponent: React.FC<IProps> = ({ ... }) => { ... };
```

## Path Alias

- `@/*` maps to `./src/*` (relative to `frontend/`)

## API Conventions

- Request body: auto-converted camelCase -> snake_case
- Response body: auto-converted snake_case -> camelCase
- Auth: Bearer token from cookies via `COOKIE_KEYS.ACCESS_TOKEN`
- Credentials: `'include'` for CORS

## ESLint Rules

- No `console.log` (allow `console.error`, `console.info`)
- Perfectionist natural ordering for imports/props
- `react/jsx-no-literals` enforced (use i18n translations)
- Unused vars must be prefixed with `_`

## Commands

### Frontend
- `cd frontend && pnpm dev` — dev server
- `cd frontend && pnpm build` — production build
- `cd frontend && pnpm lint` — ESLint check
- `cd frontend && pnpm lint:fix` — ESLint auto-fix

### Backend
- `cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000` — dev server
- `cd backend && pip install -r requirements.txt` — install dependencies
