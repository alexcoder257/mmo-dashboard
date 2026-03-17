---
name: form-schema
description: Create React Hook Form + Yup validation schemas following MMO Dashboard conventions.
metadata:
  {
    "openclaw":
      { "emoji": "📋", "requires": {}, "primaryEnv": "" },
  }
---

# form-schema

Create form validation schemas and integrate with React Hook Form for the MMO Dashboard project.

## Trigger Phrases

When the user says:
- "create a form", "add validation", "new form schema"
- "yup schema for ...", "form validation for ...", "add form fields"

## Conventions

### File Locations
- Schemas: `src/schemas/{feature}.schema.ts`
- Form components use `BaseInputFormItem` from `@/components/shared/`

### Template — Schema

```typescript
import {
  object as yupObject,
  ref as yupRef,
  string as yupString,
  number as yupNumber,
  boolean as yupBoolean,
  array as yupArray,
} from 'yup';

import { REGEXES } from '@/constants/shared.const';

export const featureSchema = yupObject({
  email: yupString()
    .required('Email is required')
    .email('Invalid email format'),
  name: yupString()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  password: yupString()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(REGEXES.PASSWORD, 'Password must contain at least 1 letter and 1 number'),
  confirmPassword: yupString()
    .required('Confirm password is required')
    .oneOf([yupRef('password')], 'Passwords do not match'),
});
```

### Template — Form Component

```typescript
'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';

import { BaseButton } from '@/components/shared/BaseButton';
import { BaseInputFormItem } from '@/components/shared/BaseInputFormItem';
import { featureSchema } from '@/schemas/feature.schema';

interface IFormData {
  email: string;
  name: string;
}

export const FeatureForm: React.FC = () => {
  const t = useTranslations('feature');

  const form = useForm<IFormData>({
    defaultValues: { email: '', name: '' },
    resolver: yupResolver(featureSchema),
  });

  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: IFormData) => {
    // Call API
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BaseInputFormItem
          control={control}
          label={t('fields.name')}
          name="name"
        />
        <BaseInputFormItem
          control={control}
          label={t('fields.email')}
          name="email"
        />
        <BaseButton htmlType="submit" customColor="primary" size="large">
          {t('submit')}
        </BaseButton>
      </form>
    </FormProvider>
  );
};
```

### Rules
1. Import Yup functions with aliases: `object as yupObject`, `string as yupString`, etc.
2. Use `REGEXES` from `@/constants/shared.const` for pattern matching
3. Schema field keys in alphabetical order
4. Use `@hookform/resolvers/yup` for `yupResolver`
5. Wrap form with `<FormProvider {...form}>` for nested field access
6. Use `BaseInputFormItem` for form fields (handles error display, labels)
7. Form data interface: `IFormData` with explicit field types
8. Validation messages should use i18n translations in production
9. `useForm` options: `defaultValues` + `resolver`
10. Submit handler is `async` for API calls
