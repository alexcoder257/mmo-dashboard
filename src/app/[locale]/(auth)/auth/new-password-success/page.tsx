'use client';

export const runtime = 'edge';

import Link from 'antd/es/typography/Link';
import { useTranslations } from 'next-intl';

import IconLogoWithColor from '@/assets/icons/auth/IconLogoWithColor.svg';
import { BaseButton } from '@/components/shared/BaseButton';

export default function NewPasswordSuccessPage() {
  const t = useTranslations();
  return (
    <div className="relative z-10 flex flex-col items-center sm:max-w-[1232px] w-full mx-auto sm:py-16">
      <div className="auth-wrapper">
        <div className="flex flex-col items-center gap-6 w-full">
          <IconLogoWithColor />
          <h1 className="text-primary_700 text-[13px]/[17px]  sm:text-[16px]/[21px] font-medium text-center sm:w-[578px]">
            {t('auth.newPasswordSuccess')}
            <br />
            <span className="text-neutrals_950 ">
              {t('auth.willBeRedirectedToLogin')}
            </span>
          </h1>
          <Link className="w-full sm:max-w-[394px]" href="/auth/login">
            <BaseButton className="w-full" size="large" type="primary">
              {t('auth.login')}
            </BaseButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
