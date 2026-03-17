import { useTranslations } from 'next-intl';
import React from 'react';

import IconFacebook from '@/assets/icons/footer/IconFacebook.svg';
import IconLogo from '@/assets/icons/footer/IconLogo.svg';
import IconTelegram from '@/assets/icons/footer/IconTelegram.svg';
import IconTikTok from '@/assets/icons/footer/IconTikTok.svg';
import IconX from '@/assets/icons/footer/IconX.svg';
import {
  ABOUT_PAGE,
  BLOG_PAGE,
  DAILY_MISSIONS_PAGE,
  TERMS_PAGE,
} from '@/constants/route-pages.const';
import { SOCIAL_MEDIA_URLS } from '@/constants/social-media.const';
import { Link } from '@/i18n/navigation';

export default function TheFooter() {
  const t = useTranslations();
  return (
    <footer className="footer-wrapper">
      <div className="max-w-[1232px] flex-1">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="flex flex-col items-start min-w-[290px]">
            <IconLogo />
            <div className="flex space-x-8 mt-6 sm:mt-[46px]">
              <a
                aria-label="Facebook"
                href={SOCIAL_MEDIA_URLS.FACEBOOK}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconFacebook />
              </a>
              <a
                aria-label="Twitter"
                href={SOCIAL_MEDIA_URLS.TWITTER}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconX />
              </a>
              <a
                aria-label="Telegram"
                href={SOCIAL_MEDIA_URLS.TELEGRAM}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconTelegram />
              </a>
              <a
                aria-label="TikTok"
                href={SOCIAL_MEDIA_URLS.TIKTOK}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconTikTok />
              </a>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-neutrals_950 text-[14px]/[18px]">
                {t('shared.footer.generalInfo')}
              </h4>
              <div className="flex flex-col gap-3">
                <Link
                  className="text-neutrals_500 text-[12px]/[16px] sm:text-[14px]/[18px]"
                  href={ABOUT_PAGE}
                >
                  {t('shared.footer.aboutUs')}
                </Link>
                <Link
                  className="text-neutrals_500 text-[12px]/[16px] sm:text-[14px]/[18px]"
                  href={BLOG_PAGE.ROOT}
                >
                  {t('shared.footer.blog')}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-neutrals_950 text-[14px]/[18px]">
                {t('shared.footer.supportHotline')}
              </h4>
              <ul className="space-y-3 text-[12px]/[16px] sm:text-sm max-w-[200px]">
                <li className="text-neutrals_500 flex items-center justify-between">
                  {t('shared.footer.callToBuy')}
                  <a
                    className="text-secondary_500 hover:underline "
                    href="tel:+84965738291"
                  >
                    {'+84 96 573 8291'}
                  </a>
                </li>
                <li className="text-neutrals_500 flex items-center justify-between ">
                  {t('shared.footer.callToConsult')}
                  <a
                    className="text-secondary_500 hover:underline"
                    href="tel:+84965738291"
                  >
                    {'+84 96 573 8291'}
                  </a>
                </li>
                <li className="text-neutrals_500 flex items-center justify-between">
                  {t('shared.footer.feedback')}
                  <a
                    className="text-secondary_500 hover:underline"
                    href="tel:+84965738291"
                  >
                    {'+84 96 573 8291'}
                  </a>
                </li>
                <li className="text-neutrals_500 flex items-center justify-between">
                  {t('shared.footer.email')}
                  <a
                    className="text-secondary_500 hover:underline"
                    href="mailto:support@mmo-dashboard.com"
                  >
                    {'support@mmo-dashboard.com'}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-neutrals_950 text-[14px]/[18px]">
                {t('shared.footer.policy')}
              </h4>
              <Link
                className="text-neutrals_500 text-[12px]/[16px] sm:text-[14px]/[18px]"
                href={TERMS_PAGE}
              >
                {t('shared.footer.termsAndConditions')}
              </Link>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-neutrals_950 text-[14px]/[18px]">
                {t('shared.footer.otherInfo')}
              </h4>
              <Link
                className="text-neutrals_500 text-[12px]/[16px] sm:text-[14px]/[18px]"
                href={DAILY_MISSIONS_PAGE}
              >
                {t('shared.footer.dailyMissions')}
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-6 sm:mt-8 mb-4" />
        <div className="text-neutrals_300 text-[14px]/[18px]">
          {t('shared.footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
