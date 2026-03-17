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
import { useState } from 'react';

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

  const config: ThemeConfig = {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    components: {
      Button: {
        primaryShadow: '',
      },
      Layout: {
        headerHeight: '75px',
      },
      Menu: {
        darkItemBg: '#111c2d',
      },
      Table: {
        borderColor: getThemeColor('BORDER'),
      },
    },
    cssVar: false,
    hashed: false,
    token: {
      colorBgContainer: getThemeColor('BACKGROUND_CONTAINER'),
      colorBgElevated: getThemeColor('BACKGROUND_ELEVATED'),
      colorBorder: getThemeColor('BORDER'),
      colorPrimary: DEFAULT_THEME.PRIMARY,
      colorText: getThemeColor('TEXT'),
      colorTextPlaceholder: getThemeColor('TEXT_PLACEHOLDER'),
      fontFamily: 'var(--font-inter)',
    },
  };

  return (
    <AntdRegistry>
      <ConfigProvider locale={locale} theme={config}>
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </AntdRegistry>
  );
};
