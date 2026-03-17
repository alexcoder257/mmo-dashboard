'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';

import IconGift from '@/assets/icons/shared/IconGift.svg';
import ProfileDetail from '@/components/profile/ProfileDetail';
import { BaseButton } from '@/components/shared/BaseButton';
import {
  AUTH_PAGE,
  DAILY_MISSIONS_PAGE,
  PROFILE_PAGE,
} from '@/constants/route-pages.const';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { useMissionDailyStatusQuery } from '@/hooks/mission/use-mission-queries';
import { useGetProfileQuery } from '@/hooks/profile/use-auth-queries';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth.store';

export default function ProfilePage() {
  const t = useTranslations();
  const { data: userInfo } = useGetProfileQuery();
  const dailyStatusQuery = useMissionDailyStatusQuery();

  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const handleLogout = async () => {
    logout();
    router.push(AUTH_PAGE.LOGIN);
  };
  return (
    <div className="w-full sm:w-[814px] mx-auto bg-white rounded-2xl flex flex-col gap-6 px-4 sm:p-6 py-6 sm:my-16">
      <div className="flex justify-between max-h-[53px] items-center">
        <div className="sm:flex flex-col gap-1 justify-between hidden">
          <div className="text-black font-semibold text-xl leading-[1.3]">
            {userInfo?.firstname}
          </div>
          <div className="text-sm leading-[1.3]"> {userInfo?.email}</div>
        </div>
        <div className="flex sm:w-fit w-full justify-between px-4 py-2 rounded-2xl  items-center gap-[10px] border border-[#CEEFFE] bg-gradient-to-t from-[#E9F8FF] to-white">
          <div className="font-semibold leading-[1.3] sm:text-base text-sm whitespace-nowrap">
            {t('profile.totalPoints', {
              points: dailyStatusQuery.data?.totalPoints?.toString() || '0',
            })}
          </div>
          <BaseButton
            className="sm:!rounded-xl !rounded-lg px-4 py-2"
            customColor="primary"
            onClick={() => {
              router.push(DAILY_MISSIONS_PAGE);
            }}
            size="middle"
          >
            <IconGift />
            <span className="sm:text-base text-[13px] leading-[1.3] font-medium text-white">
              {t('profile.exchangeGift')}
            </span>
          </BaseButton>
        </div>
      </div>
      <ProfileDetail />
      <div className="flex justify-between gap-3">
        <BaseButton
          className={`!border !border-[${DEFAULT_THEME.NEUTRAL_950}] !w-full !rounded-lg text-base leading-[1.3] font-medium`}
          colorText={DEFAULT_THEME.NEUTRAL_950}
          onClick={() => {
            router.push(PROFILE_PAGE.CHANGE_PASSWORD);
          }}
          size="middle"
          variant="outlined"
        >
          <span className="text-[13px] sm:text-base leading-[1.3] font-medium">
            {t('auth.changePassword')}
          </span>
        </BaseButton>
        <BaseButton
          className="!w-full !rounded-lg !text-primary_700 !bg-[#FFE3E5] text-base leading-[1.3] font-medium"
          onClick={() => handleLogout()}
          size="middle"
          variant="filled"
        >
          <span className="text-[13px] sm:text-base leading-[1.3] font-medium">
            {t('auth.logout')}
          </span>
        </BaseButton>
      </div>
    </div>
  );
}
