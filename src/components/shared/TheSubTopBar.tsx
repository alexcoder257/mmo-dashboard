import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import IconAI from '@/assets/icons/shared/IconAI.svg';
import IconCancel from '@/assets/icons/shared/IconCancel.svg';
import IconCategory from '@/assets/icons/shared/IconCategory.svg';
import IconHome from '@/assets/icons/shared/IconHome.svg';
import IconMission from '@/assets/icons/shared/IconMission.svg';
import IconNews from '@/assets/icons/shared/IconNews.svg';
import IconStar from '@/assets/icons/shared/IconStar.svg';
import {
  DAILY_MISSIONS_PAGE,
  HOME_PAGE,
  NEWS_PAGE,
} from '@/constants/route-pages.const';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { useAuth } from '@/hooks/shared/use-auth';
import useScreen from '@/hooks/shared/use-screen';
import { useRouter } from '@/i18n/navigation';
import { EToast } from '@/models/enums/shared.enum';
import { ACTIVE_TAB_KEY, useNavigationStore } from '@/stores/navigation.store';
import { showToast } from '@/utils/shared.util';

import DropdownCategory from '../home/DropdownCategory';
import DropdownChatAI from '../home/DropdownChatAI';
import { BaseButton } from './BaseButton';
import { BaseDropdown } from './BaseDropdown';

enum DropdownType {
  Ai = 'ai',
  Category = 'category',
}

type TabItem = {
  dropdown?: DropdownType;
  hasDropdown?: boolean;
  icon?: React.ReactNode;
  id: ACTIVE_TAB_KEY;
  path?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  title: string;
};

export function TheSubTopBar() {
  const { activeTab } = useNavigationStore();
  const isMobile = useScreen();
  const t = useTranslations();

  const tabs = [
    {
      dropdown: DropdownType.Category,
      hasDropdown: true,
      id: ACTIVE_TAB_KEY.Category,
      prefixIcon: <IconCategory height={17} width={21} />,
      suffixIcon: null,
      title: t('shared.navigator.productCategories'),
    },
    {
      id: ACTIVE_TAB_KEY.News,
      path: NEWS_PAGE.ROOT,
      prefixIcon: <IconNews height={16} width={21} />,
      suffixIcon: null,
      title: t('shared.navigator.latestNews'),
    },
    {
      id: ACTIVE_TAB_KEY.Missions,
      path: DAILY_MISSIONS_PAGE,
      prefixIcon: <IconMission height={17} width={22} />,
      suffixIcon: null,
      title: t('shared.navigator.dailyMissions'),
    },
    {
      dropdown: DropdownType.Ai,
      hasDropdown: true,
      id: ACTIVE_TAB_KEY.Ai,
      prefixIcon: <IconAI height={17} width={21} />,
      suffixIcon: <IconStar />,
      title: t('shared.navigator.aiAssistant'),
    },
  ];

  const tabsMobile = [
    {
      icon: <IconHome height={14} width={14} />,
      id: ACTIVE_TAB_KEY.Home,
      path: HOME_PAGE,
      title: t('shared.navigator.home'),
    },
    {
      icon: <IconNews height={14} width={14} />,
      id: ACTIVE_TAB_KEY.News,
      path: NEWS_PAGE.ROOT,
      title: t('shared.navigator.news'),
    },
    {
      dropdown: DropdownType.Category,
      hasDropdown: true,
      icon: <IconCategory height={14} width={14} />,
      id: ACTIVE_TAB_KEY.Category,
      title: t('shared.navigator.categories'),
    },
    {
      icon: <IconMission height={14} width={14} />,
      id: ACTIVE_TAB_KEY.Missions,
      path: DAILY_MISSIONS_PAGE,
      title: t('shared.navigator.missions'),
    },
    {
      icon: <IconAI height={14} width={14} />,
      id: ACTIVE_TAB_KEY.Ai,
      title: t('shared.navigator.aiAssistant'),
    },
  ];

  useEffect(() => {
    if (
      activeTab === ACTIVE_TAB_KEY.Ai ||
      activeTab === ACTIVE_TAB_KEY.Category
    ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeTab]);

  if (isMobile) {
    return <MobileNavigation tabsMobile={tabsMobile} />;
  }

  return <DesktopNavigation tabs={tabs} />;
}

export const MobileNavigation = ({ tabsMobile }: { tabsMobile: TabItem[] }) => {
  const { activeTab, setActiveTab } = useNavigationStore();
  const router = useRouter();

  const onSelectTab = (item: null | TabItem) => {
    setActiveTab(item ? item.id : null);
    if (item?.path) {
      router.push(item.path);
    }
  };
  return (
    <>
      <section className=" bg-[#fff] w-full fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl">
        <div className="flex justify-between h-[87px] !px-2 pt-2 shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.10)] rounded-t-2xl overflow-hidden">
          {tabsMobile.map((item) => (
            <div
              className={`flex flex-col mt-2 gap-2 items-center cursor-pointer sm:p-2 rounded-lg`}
              key={item.id}
              onClick={() => onSelectTab(item)}
            >
              <div
                className={clsx(activeTab === item.id && 'text-primary_700')}
              >
                {item.icon}
              </div>
              <div
                className={clsx(
                  'whitespace-nowrap',
                  activeTab === item.id && 'text-primary_700',
                )}
              >
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </section>
      <MobileCategoryDropdown />
      <MobileAIDropdown />
    </>
  );
};

export const MobileCategoryDropdown = () => {
  const { activeTab, setActiveTab } = useNavigationStore();
  const t = useTranslations();

  const onSelectTab = (item: null | TabItem) => {
    setActiveTab(item ? item.id : null);
  };

  return (
    activeTab === ACTIVE_TAB_KEY.Category && (
      <div
        className={clsx(
          'fixed inset-0 z-30 flex items-end justify-center sm:bg-black sm:bg-opacity-40',
          activeTab === ACTIVE_TAB_KEY.Category &&
            'top-[87px] left-0 right-0 bottom-0',
        )}
        onClick={() => onSelectTab(null)}
      >
        <div
          className="w-full bg-white sm:rounded-t-2xl sm:p-4 h-[calc(100vh-64px)] sm:max-h-[80vh] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex-between bg-secondary_950 p-2">
            <p className="text-white font-semibold text-[16px]/[21px]">
              {t('shared.navigator.productCategories')}
            </p>
            <div className="w-6 h-6 rounded-full bg-white flex-center">
              <IconCancel
                height={10}
                onClick={() => onSelectTab(null)}
                width={10}
              />
            </div>
          </div>
          <DropdownCategory onCloseDropdown={() => onSelectTab(null)} />
        </div>
      </div>
    )
  );
};

export const MobileAIDropdown = () => {
  const { activeTab, setActiveTab } = useNavigationStore();

  const onSelectTab = (item: null | TabItem) => {
    setActiveTab(item ? item.id : null);
  };
  return (
    activeTab === ACTIVE_TAB_KEY.Ai && (
      <DropdownChatAI onClose={() => onSelectTab(null)} />
    )
  );
};

export const DesktopCategoryDropdown = ({ item }: { item: TabItem }) => {
  const { activeTab, setActiveTab } = useNavigationStore();
  const { isAuthenticated } = useAuth();
  const t = useTranslations();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onSelectTab = (item: null | TabItem) => {
    if (item?.path) {
      router.push(item.path);
      setActiveTab(null);
      return;
    }
    setActiveTab(item?.id || null);
  };

  const handleCloseDropdown = () => {
    setActiveTab(null);
    setIsDropdownOpen(false);
  };

  return (
    <BaseDropdown
      disabled={!isAuthenticated}
      onOpenChange={(open) => {
        if (open && !isAuthenticated) {
          showToast(t('auth.loginFirst'), EToast.Error);
          return;
        }
        if (open) {
          setActiveTab(item.id);
          setIsDropdownOpen(true);
        } else {
          setActiveTab(null);
          setIsDropdownOpen(false);
        }
      }}
      open={isDropdownOpen && activeTab === item.id}
      placement="bottomLeft"
      popupRender={() => (
        <div className="mt-2">
          <DropdownCategory onCloseDropdown={handleCloseDropdown} />
        </div>
      )}
      trigger={['hover']}
    >
      <div>
        <BaseButton
          className={clsx(
            '!border-none',
            activeTab === item?.id && '!bg-primary_100 ',
            !isAuthenticated && 'cursor-not-allowed !bg-white',
          )}
          colorText={
            !isAuthenticated
              ? DEFAULT_THEME.NEUTRAL_300
              : DEFAULT_THEME.NEUTRAL_950
          }
          disabled={!isAuthenticated}
          onClick={() => onSelectTab(item)}
          size="large"
          variant="filled"
        >
          <div
            className={clsx(
              activeTab === item.id && 'text-primary_700',
              !isAuthenticated && 'text-neutrals_300',
            )}
          >
            {item.prefixIcon}
          </div>
          <p
            className={clsx(
              activeTab === item.id && 'text-primary_700',
              !isAuthenticated && 'text-neutrals_300',
            )}
          >
            {item.title}
          </p>
          <div
            className={clsx(
              activeTab === item.id && 'text-primary_700',
              !isAuthenticated && 'text-neutrals_300',
            )}
          >
            {item.suffixIcon}
          </div>
        </BaseButton>
      </div>
    </BaseDropdown>
  );
};

export const DesktopAIDropdown = ({
  isExpanded,
  item,
  setIsExpanded,
}: {
  isExpanded: boolean;
  item: TabItem;
  setIsExpanded: (value: boolean) => void;
}) => {
  const activeTab = useNavigationStore((state) => state.activeTab);
  const setActiveTab = useNavigationStore((state) => state.setActiveTab);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const onSelectTab = (item: null | TabItem) => {
    if (item?.path) {
      router.push(item.path);
      setActiveTab(null);
      return;
    }
    setActiveTab(item?.id || null);
  };

  const handleClick = () => {
    if (activeTab === item.id) {
      onSelectTab(null);
    } else {
      onSelectTab(item);
    }
  };

  return (
    <div className="relative inline-block">
      <BaseButton
        className={clsx(
          '!border-none',
          activeTab === item.id && '!bg-primary_100',
          !isAuthenticated && 'cursor-not-allowed !bg-white',
        )}
        colorText={
          !isAuthenticated
            ? DEFAULT_THEME.NEUTRAL_300
            : DEFAULT_THEME.NEUTRAL_950
        }
        disabled={!isAuthenticated}
        onClick={handleClick}
        size="large"
        variant="filled"
      >
        <div
          className={clsx(
            activeTab === item.id && 'text-primary_700',
            !isAuthenticated && 'text-neutrals_300',
          )}
        >
          {item.prefixIcon}
        </div>
        <p
          className={clsx(
            activeTab === item.id && 'text-primary_700',
            !isAuthenticated && 'text-neutrals_300',
          )}
        >
          {item.title}
        </p>
        <div
          className={clsx(
            activeTab === item.id && 'text-primary_700',
            !isAuthenticated && 'text-neutrals_300',
          )}
        >
          {item.suffixIcon}
        </div>
      </BaseButton>

      {activeTab === item.id && isAuthenticated && (
        <div className="fixed top-[121px] left-0 right-0 bottom-0 flex items-start pt-2 justify-center z-[1000] bg-black bg-opacity-50">
          <div className="w-full sm:w-[800px] max-h-[70vh] sm:max-h-[80vh]">
            <DropdownChatAI
              isExpanded={isExpanded}
              onClose={() => onSelectTab(null)}
              setIsExpanded={setIsExpanded}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const DesktopRegularButton = ({ item }: { item: TabItem }) => {
  const activeTab = useNavigationStore((state) => state.activeTab);
  const setActiveTab = useNavigationStore((state) => state.setActiveTab);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const onSelectTab = (item: null | TabItem) => {
    if (item?.path) {
      router.push(item.path);
      setActiveTab(item.id);
      return;
    }
    setActiveTab(item?.id || null);
  };

  return (
    <BaseButton
      className={clsx(
        '!border-none',
        activeTab === item.id && '!bg-primary_100',
        !isAuthenticated && 'cursor-not-allowed !bg-white',
      )}
      colorText={
        !isAuthenticated ? DEFAULT_THEME.NEUTRAL_300 : DEFAULT_THEME.NEUTRAL_950
      }
      disabled={!isAuthenticated}
      onClick={() => onSelectTab(item)}
      size="large"
      variant="filled"
    >
      <div
        className={clsx(
          activeTab === item.id && 'text-primary_700',
          !isAuthenticated && 'text-neutrals_300',
        )}
      >
        {item.prefixIcon}
      </div>
      <p
        className={clsx(
          activeTab === item.id && 'text-primary_700',
          !isAuthenticated && 'text-neutrals_300',
        )}
      >
        {item.title}
      </p>
      <div
        className={clsx(
          activeTab === item.id && 'text-primary_700',
          !isAuthenticated && 'text-neutrals_300',
        )}
      >
        {item.suffixIcon}
      </div>
    </BaseButton>
  );
};

export const DesktopNavigation = ({ tabs }: { tabs: TabItem[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className=" bg-[#fff] w-full">
      <div className="max-w-[1008px] flex items-center justify-between h-[57px] mx-auto">
        <DesktopCategoryDropdown
          item={tabs.find((tab) => tab.id === ACTIVE_TAB_KEY.Category)!}
        />
        <DesktopRegularButton
          item={tabs.find((tab) => tab.id === ACTIVE_TAB_KEY.News)!}
        />
        <DesktopRegularButton
          item={tabs.find((tab) => tab.id === ACTIVE_TAB_KEY.Missions)!}
        />
        <DesktopAIDropdown
          isExpanded={isExpanded}
          item={tabs.find((tab) => tab.id === ACTIVE_TAB_KEY.Ai)!}
          setIsExpanded={setIsExpanded}
        />
      </div>
    </section>
  );
};
