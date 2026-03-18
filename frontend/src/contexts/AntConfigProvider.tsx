'use client';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import {
  theme as antTheme,
  ConfigProvider,
  ConfigProviderProps,
  type ThemeConfig,
} from 'antd';
import { App as AntApp } from 'antd';
import enUS from 'antd/locale/en_US';
import { useMemo, useState } from 'react';

import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { useTheme } from '@/hooks/shared/use-theme';
import { useThemeColor } from '@/hooks/shared/use-theme-color';

interface IProps {
  children: React.ReactNode;
}

type TLocale = ConfigProviderProps['locale'];

export const AntConfigProvider: React.FC<IProps> = ({ children }) => {
  const { isDark } = useTheme();
  const { getThemeColor } = useThemeColor();
  const [locale, _setLocale] = useState<TLocale>(enUS);

  const config: ThemeConfig = useMemo(
    () => ({
      algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      components: {
        Button: {
          primaryShadow: '',
        },
        Card: {
          colorBgContainer: isDark ? '#111827' : '#ffffff',
          colorBorderSecondary: isDark
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(0, 0, 0, 0.06)',
        },
        Layout: {
          bodyBg: 'transparent',
          headerBg: 'var(--topbar-bg)',
          headerHeight: 56,
          siderBg: 'var(--sidebar-bg)',
        },
        Menu: {
          darkItemBg: 'transparent',
          darkItemColor: '#7b8ba5',
          darkItemHoverBg: 'var(--sidebar-hover)',
          darkItemHoverColor: '#e2e8f0',
          darkItemSelectedBg: 'var(--sidebar-active-bg)',
          darkItemSelectedColor: '#818cf8',
          darkSubMenuItemBg: 'transparent',
          itemBorderRadius: 8,
          itemHeight: 42,
          itemMarginInline: 8,
        },
        Table: {
          borderColor: getThemeColor('BORDER'),
        },
      },
      cssVar: false,
      hashed: false,
      token: {
        borderRadius: 10,
        colorBgContainer: getThemeColor('BACKGROUND_CONTAINER'),
        colorBgElevated: getThemeColor('BACKGROUND_ELEVATED'),
        colorBorder: getThemeColor('BORDER'),
        colorPrimary: DEFAULT_THEME.PRIMARY,
        colorText: getThemeColor('TEXT'),
        colorTextPlaceholder: getThemeColor('TEXT_PLACEHOLDER'),
        fontFamily: 'var(--font-inter)',
      },
    }),
    [isDark, getThemeColor],
  );

  return (
    <AntdRegistry>
      <ConfigProvider locale={locale} theme={config}>
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </AntdRegistry>
  );
};
