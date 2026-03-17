---
name: i18n-locale
description: Add i18n translations and locale support following MMO Dashboard conventions (next-intl, en/vi/ja).
metadata:
  {
    "openclaw":
      { "emoji": "🌐", "requires": {}, "primaryEnv": "" },
  }
---

# i18n-locale

Manage internationalization and translations for the MMO Dashboard project.

## Trigger Phrases

When the user says:
- "add translations", "translate to ...", "add locale support"
- "i18n for ...", "add text for ...", "internationalize ..."

## Conventions

### File Locations
- Translation files: `locales/{locale}.json` (en.json, vi.json, ja.json)
- i18n config: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`

### Supported Locales
- `en` — English (default)
- `vi` — Vietnamese
- `ja` — Japanese

### Template — Adding Translations

```json
// locales/en.json
{
  "feature": {
    "title": "Feature Title",
    "description": "Feature description",
    "fields": {
      "name": "Name",
      "email": "Email"
    },
    "actions": {
      "submit": "Submit",
      "cancel": "Cancel"
    },
    "messages": {
      "success": "Operation successful",
      "error": "Something went wrong"
    }
  }
}
```

### Usage in Components

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('feature');
// t('title') → "Feature Title"
// t('fields.name') → "Name"
```

### Rules
1. ESLint enforces `react/jsx-no-literals` — ALL user-facing text must use `useTranslations`
2. Add translations to ALL three locale files (en, vi, ja)
3. Nest keys by feature → section → item
4. Keep key names in camelCase
5. Locale cookie: `N_LANGUAGE` with 365-day expiry
6. Routes: `/{locale}/...` (e.g., `/en/products`, `/vi/products`)
