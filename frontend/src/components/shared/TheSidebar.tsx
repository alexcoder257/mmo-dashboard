'use client';
import { Menu } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import faviconPng from '@/assets/icons/shared/favicon.png';
import IconAnalyzer from '@/assets/icons/shared/IconAnalyzer.svg';
import IconHome from '@/assets/icons/shared/IconHome.svg';
import IconSettings from '@/assets/icons/shared/IconSettings.svg';
import IconTiktok from '@/assets/icons/shared/IconTiktok.svg';
import {
  HOME_PAGE,
  SETTINGS_PAGE,
  TIKTOK_PAGE,
  TRAVEL_PAGE,
} from '@/constants/route-pages.const';
import { Link, useRouter } from '@/i18n/navigation';
import { useNavigationStore } from '@/stores/navigation.store';

const ICON_PROPS = { height: 18, width: 18 };

export const TheSidebar: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const isSidebarCollapsed = useNavigationStore(
    (state) => state.isSidebarCollapsed,
  );

  const mainMenuItems = useMemo(
    () => [
      {
        icon: <IconHome {...ICON_PROPS} />,
        key: HOME_PAGE,
        label: t('shared.navigator.home'),
      },
      {
        icon: <IconTiktok {...ICON_PROPS} />,
        key: TIKTOK_PAGE,
        label: t('shared.navigator.tiktok'),
      },
      {
        icon: <IconAnalyzer {...ICON_PROPS} />,
        key: TRAVEL_PAGE,
        label: t('shared.navigator.travel'),
      },
    ],
    [t],
  );

  const bottomMenuItems = useMemo(
    () => [
      {
        icon: <IconSettings {...ICON_PROPS} />,
        key: SETTINGS_PAGE,
        label: t('shared.settings'),
      },
    ],
    [t],
  );

  const selectedKey = useMemo(() => {
    const strippedPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const allItems = [...mainMenuItems, ...bottomMenuItems];
    const match = allItems.find(
      (item) =>
        strippedPath === item.key ||
        (item.key !== '/' && strippedPath.startsWith(item.key + '/')),
    );
    return match?.key || HOME_PAGE;
  }, [pathname, mainMenuItems, bottomMenuItems]);

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--sidebar-bg)' }}>
      <div className="flex items-center justify-center py-6 px-4">
        <Link href={HOME_PAGE} prefetch>
          <Image
            alt="Logo"
            height={isSidebarCollapsed ? 32 : 28}
            src={faviconPng}
            width={isSidebarCollapsed ? 32 : 28}
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Menu
          items={mainMenuItems}
          mode="inline"
          onClick={({ key }) => router.push(key)}
          selectedKeys={[selectedKey]}
          style={{ background: 'transparent', border: 'none' }}
          theme="dark"
        />
      </div>

      <div
        className="px-2 pb-4 pt-2"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <Menu
          items={bottomMenuItems}
          mode="inline"
          onClick={({ key }) => router.push(key)}
          selectedKeys={[selectedKey]}
          style={{ background: 'transparent', border: 'none' }}
          theme="dark"
        />
      </div>
    </div>
  );
};
