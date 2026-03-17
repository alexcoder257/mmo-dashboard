'use client';
import { Menu } from 'antd';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import IconDashboard from '@/assets/icons/shared/IconDashboard.svg';
import IconFolderShared from '@/assets/icons/shared/IconFolderShared.svg';
import IconLogo from '@/assets/icons/shared/IconLogo.svg';
import IconSettings from '@/assets/icons/shared/IconSettings.svg';
import styles from '@/assets/styles/components/shared/the-sidebar.module.scss';
import {
  AUTH_PAGE,
  CODEBASE_PAGE,
  DASHBOARD_PAGE,
  HOME_PAGE,
} from '@/constants/route-pages.const';
import { useTheme } from '@/hooks/shared/use-theme';
import { useThemeColor } from '@/hooks/shared/use-theme-color';
import { Link, useRouter } from '@/i18n/navigation';

export const TheSidebar: React.FC = () => {
  const t = useTranslations();
  const { isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { getThemeColor } = useThemeColor();

  const menuItems = [
    {
      icon: <IconDashboard fill={getThemeColor('ICON_SVG')} />,
      key: DASHBOARD_PAGE,
      label: t('shared.navigator.dashboard'),
    },
    {
      icon: <IconSettings fill={getThemeColor('ICON_SVG')} />,
      key: AUTH_PAGE.REGISTER,
      label: t('shared.navigator.register'),
    },
    {
      icon: <IconFolderShared fill={getThemeColor('ICON_SVG')} />,
      key: CODEBASE_PAGE,
      label: t('shared.navigator.codebase'),
    },
  ];
  const selectedKey =
    menuItems.find((item) => item.key === pathname)?.key || '';

  return (
    <div className={styles['container']}>
      <div className={styles['container__logo']}>
        <Link href={HOME_PAGE} prefetch>
          <IconLogo />
        </Link>
      </div>

      <Menu
        items={menuItems.map((item) => ({
          icon: item.icon,
          key: item.key,
          label: item.label,
        }))}
        mode="inline"
        onClick={({ key }) => router.push(key)}
        selectedKeys={[selectedKey]}
        theme={isDark ? 'dark' : 'light'}
      />
    </div>
  );
};
