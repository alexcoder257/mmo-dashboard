'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import React from 'react';

import IconAuthEmail from '@/assets/icons/auth/IconAuthEmail.svg';
import IconAuthPassword from '@/assets/icons/auth/IconAuthPassword.svg';
import IconAuthUser from '@/assets/icons/auth/IconAuthUser.svg';
import IconLogoWithColor from '@/assets/icons/auth/IconLogoWithColor.svg';
import { BaseButton } from '@/components/shared/BaseButton';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth.store';

export default function RegisterSuccess() {
  const t = useTranslations();
  const registrationInfo = useAuthStore((state) => state.registrationInfo);

  return (
    <div className="relative z-10 flex flex-col items-center sm:max-w-[1232px] w-full mx-auto sm:py-16">
      <div className="auth-wrapper">
        <div className="flex flex-col items-center gap-6 sm:mb-8">
          <IconLogoWithColor />
          <h1 className="text-primary_700 text-[13px]/[17px] sm:text-[16px]/[21px] font-medium text-center sm:w-[578px]">
            {t('auth.registerSuccess')}
            <br />
            <span className="text-neutrals_950">{t('auth.yourLoginInfo')}</span>
          </h1>
        </div>
        <div className="w-full sm:w-[394px] flex flex-col items-start border rounded-lg gap-4 px-5 py-3">
          <div className="flex gap-2 items-center">
            <IconAuthEmail />
            <span>{registrationInfo?.email || t('auth.emailExample')}</span>
          </div>
          <div className="border-b border-neutrals_200 w-full"></div>
          <div className="flex gap-2 items-center">
            <IconAuthUser />
            <span>
              {registrationInfo?.firstname || t('auth.usernameExample')}
            </span>
          </div>
          <div className="border-b border-neutrals_200 w-full"></div>
          <div className="flex gap-2 items-center">
            <IconAuthPassword />
            <span>
              {registrationInfo?.password || t('auth.passwordExample')}
            </span>
          </div>
        </div>
        <Link className="w-full sm:w-[394px]" href="/auth/login">
          <BaseButton
            className="w-full"
            htmlType="button"
            size="large"
            type="primary"
          >
            {t('auth.login')}
          </BaseButton>
        </Link>
      </div>
    </div>
  );
}
