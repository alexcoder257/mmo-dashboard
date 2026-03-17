'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import stringTemplate from 'string-template';
import { useDebounceValue } from 'usehooks-ts';

import IconLoading from '@/assets/icons/shared/IconLoading.svg';
import IconLogo from '@/assets/icons/shared/IconLogo.svg';
import IconLogoMobile from '@/assets/icons/shared/IconLogoMobile.svg';
import IconProfile from '@/assets/icons/shared/IconProfile.svg';
import IconSearch from '@/assets/icons/shared/IconSearch.svg';
import {
  AUTH_PAGE,
  PRODUCT_DETAIL_PAGE,
  PROFILE_PAGE,
} from '@/constants/route-pages.const';
import { DEBOUNCE_TIME } from '@/constants/shared.const';
import { useSearchSuggestionsQuery } from '@/hooks/search/use-search-queries';
import { useAuth } from '@/hooks/shared/use-auth';
import useScreen from '@/hooks/shared/use-screen';
import { useRouter } from '@/i18n/navigation';
import { useCategoryStore } from '@/stores/category.store';
import { ACTIVE_TAB_KEY, useNavigationStore } from '@/stores/navigation.store';
import { getProductImage, mapProductValue } from '@/utils/product.util';

import { BaseButton } from './BaseButton';
import { BaseDropdown } from './BaseDropdown';
import { BaseInput } from './BaseInput';

export const TheTopbar: React.FC = () => {
  const t = useTranslations();
  const { initialize, isAuthenticated, logout } = useAuth();
  const initializeCategory = useCategoryStore((state) => state.initialize);
  const router = useRouter();
  const isCategoryInitialized = useRef(false);
  const isMobile = useScreen();
  const { setActiveTab } = useNavigationStore();

  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [debouncedSearchTerm] = useDebounceValue(search, DEBOUNCE_TIME);

  const handleLogout = async () => {
    logout();
    router.push(AUTH_PAGE.LOGIN);
  };

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isCategoryInitialized.current) {
      initializeCategory();
      isCategoryInitialized.current = true;
    }
  }, [initializeCategory]);

  const searchSuggestionsQuery = useSearchSuggestionsQuery(debouncedSearchTerm);
  const searchResults =
    searchSuggestionsQuery.data?.items.map(mapProductValue) || [];

  const showResults = debouncedSearchTerm.length >= 2 && isSearchFocused;
  const showNoResults =
    showResults &&
    !searchSuggestionsQuery.isLoading &&
    searchResults.length === 0;

  const searchDropdownItems = showResults
    ? [
        ...searchResults.map((product) => ({
          key: `product-${product.id}`,
          label: (
            <Link
              className="flex items-center gap-2 p-2"
              href={stringTemplate(PRODUCT_DETAIL_PAGE, { id: product.sku })}
              onClick={() => setSearch('')}
            >
              <div className="relative w-12 h-9 sm:w-16 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  alt={product.name}
                  className="object-contain"
                  fill
                  src={getProductImage(product.img as string)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] sm:text-[13px] font-medium leading-[16px] sm:leading-[17px] line-clamp-2">
                  {product.name}
                </p>
              </div>
            </Link>
          ),
        })),
        ...(showNoResults
          ? [
              {
                disabled: true,
                key: 'no-results',
                label: (
                  <div className="text-center text-[#BDBDBD] py-4 text-sm">
                    {t('search.noProductsFound', {
                      default: 'No products found',
                    })}
                  </div>
                ),
              },
            ]
          : []),
      ]
    : [];

  return (
    <section className="bg-primary_700 h-[64px]">
      <div className="flex items-center h-full justify-between gap-3 sm:gap-20 mx-auto max-w-[1008px] w-full px-2 sm:px-0">
        <Link
          className="min-w-10"
          href="/"
          onClick={() => setActiveTab(ACTIVE_TAB_KEY.Home)}
        >
          {isMobile ? <IconLogoMobile /> : <IconLogo />}
        </Link>

        <div className="flex-1 relative">
          <BaseDropdown
            menu={{
              items: searchDropdownItems,
              style: {
                maxHeight: isMobile ? '400px' : '300px',
                overflowY: 'auto',
                scrollbarColor: '#d1d5db #f3f4f6',
                scrollbarWidth: 'thin',
              },
            }}
            onOpenChange={(open) => setIsSearchFocused(open)}
            open={showResults}
            overlayStyle={{
              maxWidth: isMobile ? 'calc(100vw - 32px)' : '400px',
              width: '100%',
            }}
            placement={isMobile ? 'bottom' : 'bottomLeft'}
            trigger={[]}
          >
            <div className="px-3 sm:px-5 flex items-center gap-2 border border-neutrals_200 h-[42px] rounded-[100px] bg-[#ffffffb8]">
              <BaseInput
                className="!h-full !flex-1 !border-none !text-[14px]/[18px] !bg-transparent placeholder:!text-neutrals_950"
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={
                  isMobile
                    ? t('search.placeholderMobile')
                    : t('search.placeholder')
                }
                value={search}
                variant="borderless"
              />
              {searchSuggestionsQuery.isLoading && debouncedSearchTerm ? (
                <IconLoading className="animate-spin" height={16} width={16} />
              ) : (
                <IconSearch />
              )}
            </div>
          </BaseDropdown>
        </div>

        {isAuthenticated ? (
          <BaseDropdown
            menu={{
              items: [
                {
                  key: 'profile',
                  label: t('profile.title'),
                  onClick: () => router.push(PROFILE_PAGE.ROOT),
                },
                // {
                //   key: 'settings',
                //   label: t('settings.title'),
                //   onClick: () => router.push(SETTINGS_PAGE),
                // },
                { type: 'divider' },
                {
                  key: 'logout',
                  label: t('auth.logout'),
                  onClick: () => handleLogout(),
                },
              ],
            }}
          >
            <BaseButton
              className="!text-[16px]/[21px]"
              colorText="#fff"
              customColor="secondary"
              size={isMobile ? 'middle-large' : 'middle'}
              variant="filled"
            >
              <IconProfile />
              {!isMobile && t('profile.title')}
            </BaseButton>
          </BaseDropdown>
        ) : (
          <BaseButton
            className="!text-[16px]/[21px]"
            colorText="#fff"
            customColor="secondary"
            onClick={() => router.push(AUTH_PAGE.LOGIN)}
            size={isMobile ? 'middle-large' : 'middle'}
            variant="filled"
          >
            <IconProfile />
            {!isMobile && t('auth.login')}
          </BaseButton>
        )}
      </div>
    </section>
  );
};
