import { DARK_THEME, LIGHT_THEME } from '@/constants/theme-colors.const';

import { useTheme } from './use-theme';

interface ICustomColors {
  DARK?: string;
  LIGHT?: string;
}

export const useThemeColor = () => {
  const { theme } = useTheme();

  const getThemeColor = (
    colorName: keyof typeof DARK_THEME & keyof typeof LIGHT_THEME,
    customColors?: ICustomColors,
  ) => {
    const customColor = customColors?.[theme as keyof ICustomColors];
    const themeColor =
      theme === 'DARK' ? DARK_THEME[colorName] : LIGHT_THEME[colorName];

    return customColor || themeColor;
  };

  return { getThemeColor };
};
