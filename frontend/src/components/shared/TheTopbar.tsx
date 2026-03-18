'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import IconSearch from '@/assets/icons/shared/IconSearch.svg';
import useScreen from '@/hooks/shared/use-screen';
import { useTheme } from '@/hooks/shared/use-theme';
import { useNavigationStore } from '@/stores/navigation.store';

import { BaseInput } from './BaseInput';

export const TheTopbar: React.FC = () => {
  const t = useTranslations();
  const isMobile = useScreen();
  const { changeTheme, isDark } = useTheme();
  const toggleSidebar = useNavigationStore((state) => state.toggleSidebar);

  const [search, setSearch] = useState('');

  return (
    <div
      className="flex items-center h-14 px-4 sm:px-6 gap-4"
      style={{
        background: 'var(--topbar-bg)',
        borderBottom: '1px solid var(--topbar-border)',
      }}
    >
      <button
        className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
        onClick={toggleSidebar}
        style={{ color: 'var(--n-text-color)' }}
        type="button"
      >
        <svg
          fill="none"
          height="20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="20"
        >
          <line x1="3" x2="21" y1="6" y2="6" />
          <line x1="3" x2="21" y1="12" y2="12" />
          <line x1="3" x2="21" y1="18" y2="18" />
        </svg>
      </button>

      <div className="flex-1 max-w-md">
        <div
          className="flex items-center gap-2 h-9 px-3 rounded-lg"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid transparent',
          }}
        >
          <IconSearch
            className="flex-shrink-0"
            style={{
              color: isDark ? '#64748b' : '#94a3b8',
              height: 16,
              width: 16,
            }}
          />
          <BaseInput
            className="!h-full !flex-1 !border-none !text-sm !bg-transparent !shadow-none"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isMobile
                ? t('search.placeholderMobile')
                : t('search.placeholder')
            }
            value={search}
            variant="borderless"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
          onClick={changeTheme}
          style={{ color: isDark ? '#94a3b8' : '#64748b' }}
          title={isDark ? 'Light mode' : 'Dark mode'}
          type="button"
        >
          {isDark ? (
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="18"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" x2="12" y1="1" y2="3" />
              <line x1="12" x2="12" y1="21" y2="23" />
              <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
              <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
              <line x1="1" x2="3" y1="12" y2="12" />
              <line x1="21" x2="23" y1="12" y2="12" />
              <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
              <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
            </svg>
          ) : (
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
