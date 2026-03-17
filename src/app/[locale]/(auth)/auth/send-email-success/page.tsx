'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';

import IconLogoWithColor from '@/assets/icons/auth/IconLogoWithColor.svg';

export default function SendEmailSuccessPage() {
  const t = useTranslations();
  return (
    <div className="relative z-10 flex flex-col items-center sm:max-w-[1232px] w-full mx-auto sm:py-16">
      <div className="auth-wrapper">
        <div className="flex flex-col items-center gap-6 w-full">
          <IconLogoWithColor />
          <h1 className="text-primary_700 text-[13px]/[17px] sm:text-[16px]/[21px] font-medium text-center sm:w-[578px]">
            {t('auth.emailSentSuccess')}
            <br />
            <span className="text-neutrals_950 ">
              {t('auth.emailInstruction')}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
