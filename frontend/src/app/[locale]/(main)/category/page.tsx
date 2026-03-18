'use client';

export const runtime = 'edge';

import { Skeleton } from 'antd';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { StaticImageData } from 'next/image';
import { useState } from 'react';
// import { SwiperSlide } from 'swiper/react';

import IconCategoryFilter from '@/assets/icons/categories/IconCategoryFilter.svg';
import IconAdd from '@/assets/icons/shared/IconAdd.svg';
import IconGrid from '@/assets/icons/shared/IconGrid.svg';
import IconList from '@/assets/icons/shared/IconList.svg';
// import IconMostView from '@/assets/icons/shared/IconMostView.svg';
import IconTagNew from '@/assets/icons/shared/IconTagNew.svg';
// import FilterImgFifth from '@/assets/images/categories/filter-fifth.png';
// import FilterImgFirst from '@/assets/images/categories/filter-first.png';
// import FilterImgFourth from '@/assets/images/categories/filter-fourth.png';
// import FilterImgSecond from '@/assets/images/categories/filter-second.png';
// import FilterImgSeventh from '@/assets/images/categories/filter-seventh.png';
// import FilterImgSixth from '@/assets/images/categories/filter-sixth.png';
// import FilterImgThird from '@/assets/images/categories/filter-third.png';
import CategoriesBanner from '@/components/categories/CategoriesBanner';
import ModalFilter from '@/components/categories/ModalFilter';
import CardProduct from '@/components/product/CardProduct';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb';
import { BaseButton } from '@/components/shared/BaseButton';
// import BaseSwiper from '@/components/shared/BaseSwiper';
import { PRODUCT_API_QUERY } from '@/constants/product.const';
import { HOME_PAGE } from '@/constants/route-pages.const';
import { MODAL_KEYS } from '@/constants/shared.const';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { useCategoryListQuery } from '@/hooks/category/use-category-queries';
import {
  useProductsInfiniteQueryByCategory,
  useProductsInfiniteQueryWithFilters,
} from '@/hooks/product/use-product-queries';
import { useInfiniteScroll } from '@/hooks/shared/use-infinite-scroll';
import useQueryParams from '@/hooks/shared/use-query-params';
// import useScreen from '@/hooks/shared/use-screen';
import { ErrorCompare } from '@/models/enums/compare.enum';
import { EMessage } from '@/models/enums/shared.enum';
import {
  ICustomAttribute,
  IProductQueryParams,
} from '@/models/interfaces/product.interface';
import { TViewType } from '@/models/types/product.type';
import { useCompareStore } from '@/stores/compare.store';
import { useModalStore } from '@/stores/modal.store';
import { getProductImage, mapProductToCardProduct } from '@/utils/product.util';
import { showMessage } from '@/utils/shared.util';

// const filterChips = [
//   { img: FilterImgFirst },
//   { img: FilterImgSecond },
//   { img: FilterImgThird },
//   { img: FilterImgFourth },
//   { img: FilterImgFifth },
//   { img: FilterImgSixth },
//   { img: FilterImgSeventh },
// ];

type TSelectOptions = Record<string, null | string>;

const CategoryPage: React.FC = () => {
  const { id: categoryId } = useQueryParams(['id']);

  const t = useTranslations();
  // const isMobile = useScreen();

  const [filterOpen, setFilterOpen] = useState(false);
  const [viewType, setViewType] = useState<TViewType>('grid');
  const [shouldEnableInfiniteScroll, setShouldEnableInfiniteScroll] =
    useState(false);
  const [currentFilters, setCurrentFilters] = useState<
    IProductQueryParams['filter'] | null
  >(null);

  const categoryListQuery = useCategoryListQuery({
    depth: 1,
    rootCategoryId: Number(categoryId),
  });

  const productsInfiniteQuery = useProductsInfiniteQueryByCategory(
    categoryId || '',
  );

  const filteredProductsInfiniteQuery = useProductsInfiniteQueryWithFilters(
    categoryId || '',
    currentFilters || {},
    !!currentFilters,
  );

  const activeQuery = currentFilters
    ? filteredProductsInfiniteQuery
    : productsInfiniteQuery;

  const { handleLoadMore, targetRef } = useInfiniteScroll({
    fetchNextPage: activeQuery.fetchNextPage,
    hasNextPage: activeQuery.hasNextPage,
    isFetchingNextPage: activeQuery.isFetchingNextPage,
  });

  const addProduct = useCompareStore((state) => state.addProduct);
  const openModal = useModalStore((state) => state.openModal);

  const allProducts =
    activeQuery.data?.pages.flatMap((page) => page.items) || [];

  const totalCount = activeQuery.data?.pages[0]?.totalCount || 0;
  const currentCount = allProducts.length;

  const productsMapped = allProducts.map((product) =>
    mapProductToCardProduct(product),
  );

  const finalProducts = productsMapped;

  const shouldShowNoProducts =
    !activeQuery.isLoading &&
    finalProducts.length === 0 &&
    categoryListQuery.data;

  const handleAddCompare = (product: {
    attributeSetId: number;
    customAttributes?: ICustomAttribute[];
    id: number;
    img: StaticImageData | string;
    properties: Record<string, string>;
    title: string;
  }) => {
    const result = addProduct({
      ...product,
      img: getProductImage(product.img as string),
    });

    if (!result.success) {
      const errorMessages: Record<ErrorCompare, string | undefined> = {
        [ErrorCompare.DifferentAttributeSet]: t(
          'compare.differentAttributeSetError',
        ),
        [ErrorCompare.Duplicate]: undefined,
        [ErrorCompare.MaxProducts]: t('compare.maxProductsError'),
      };

      const errorMessage = result.error
        ? errorMessages[result.error]
        : undefined;
      if (errorMessage) showMessage(errorMessage, EMessage.Error);
      return;
    }
    openModal(MODAL_KEYS.COMPARE_MODAL);
  };

  const handleStartInfiniteScroll = () => {
    setShouldEnableInfiniteScroll(true);
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  };

  const handleFilteredProductsChange = async (selected: TSelectOptions) => {
    const options = Object.entries(selected)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => ({ [key]: value }));

    if (options.length === 0) {
      setCurrentFilters(null);
    } else {
      setCurrentFilters({
        categoryId: [Number(categoryId)],
        options,
      });
    }
  };

  const handleResetFilter = () => {
    setCurrentFilters(null);
  };

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  return (
    <div className="bg-[#F6F6F6] min-h-screen flex flex-col items-center w-full max-w-[1232px] mx-auto mb-6 sm:mb-[64px]">
      <ModalFilter
        isLoading={activeQuery.isLoading}
        onClose={handleCloseFilter}
        onFilteredProductsChange={handleFilteredProductsChange}
        onResetFilter={handleResetFilter}
        open={filterOpen}
        productsCount={finalProducts.length}
      />
      <div className="w-full pt-8 pb-4">
        <BaseBreadcrumb
          className="text-xs font-medium"
          items={[
            { href: HOME_PAGE, label: 'Home' },
            { label: categoryListQuery.data?.name || '' },
          ]}
        />
      </div>
      <div className="w-full mb-12">
        <CategoriesBanner />
      </div>
      <div className="p-4 sm:p-6 bg-white rounded-2xl w-full">
        <div className="mb-4 sm:mb-6">
          <div className="flex gap-6 overflow-x-auto pb-2">
            <BaseButton
              className="flex items-center gap-2 !bg-primary_50 rounded-lg px-4 py-2 w-fit !border-none"
              onClick={() => setFilterOpen(true)}
              size="large"
              variant="outlined"
            >
              <IconCategoryFilter />
              <span className={`text-neutrals_950 text-base font-medium`}>
                {t('category.filter')}
              </span>
            </BaseButton>
            {/* <BaseSwiper
              hideNavigation={true}
              keySwiper="filter-chips"
              slidesPerView={'auto' as unknown as number}
              spaceBetween={isMobile ? 16 : 24}
            >
              {filterChips.map((chip, idx) => (
                <SwiperSlide className="!w-auto" key={idx}>
                  <div className="flex-center rounded-lg !bg-neutrals_100 px-4 h-[45px] w-fit">
                    <Image
                      alt={`filter-chip-${idx + 1}`}
                      className="w-auto h-auto max-h-[21px] object-contain"
                      src={chip.img}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </BaseSwiper> */}
          </div>
        </div>
        <div className="border border-b-neutrals_200 mb-4 sm:mb-6"></div>
        <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row">
          <div className="flex gap-2 items-center mb-2 sm:mb-0">
            <p className="text-[16px]/[21px] font-medium">
              {t('category.sortBy')}
            </p>
            <BaseButton
              className="!border-none"
              colorText={DEFAULT_THEME.PRIMARY}
              customColor="transparent"
              size="large"
            >
              <IconTagNew />
              {t('category.newest')}
            </BaseButton>
            {/* <div className="w-[1px] h-[20px] bg-neutrals_300"></div>
            <div className="flex gap-2 items-center">
              <BaseButton
                className="!border-none"
                colorText={DEFAULT_THEME.NEUTRAL_300}
                customColor="transparent"
                size="large"
              >
                <IconMostView />
                {t('category.mostViewed')}
              </BaseButton>
            </div> */}
          </div>
          <div className="p-1 rounded-md border border-neutrals_200 flex w-full sm:w-fit">
            <BaseButton
              className="!rounded-[4px] flex-1 sm:flex-initial !border-none"
              colorText={
                viewType === 'grid'
                  ? DEFAULT_THEME.WHITE
                  : DEFAULT_THEME.NEUTRAL_950
              }
              customColor={viewType === 'grid' ? 'primary' : 'transparent'}
              onClick={() => setViewType('grid')}
            >
              <IconGrid />
              {t('category.gridView')}
            </BaseButton>
            <BaseButton
              className="!rounded-[4px] flex-1 sm:flex-initial !border-none"
              colorText={
                viewType === 'list'
                  ? DEFAULT_THEME.WHITE
                  : DEFAULT_THEME.NEUTRAL_950
              }
              customColor={viewType === 'list' ? 'primary' : 'transparent'}
              onClick={() => setViewType('list')}
            >
              <IconList />
              {t('category.listView')}
            </BaseButton>
          </div>
        </div>
        {activeQuery.isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-4 sm:mb-6">
            {Array.from({ length: PRODUCT_API_QUERY.DEFAULT.PAGE_SIZE }).map(
              (_, index) => (
                <div className="flex flex-col" key={index}>
                  <Skeleton.Image
                    active
                    className="!w-full !h-48 !rounded-lg mb-4"
                  />
                  <Skeleton.Input
                    active
                    className="!w-full mb-2"
                    size="small"
                  />
                  <Skeleton.Input active className="!w-3/4" size="small" />
                </div>
              ),
            )}
          </div>
        )}
        <div
          className={clsx(
            'grid gap-6 mb-4 sm:mb-6',
            viewType === 'grid' && 'grid-cols-2 sm:grid-cols-4',
            viewType === 'list' && 'grid-cols-1',
          )}
        >
          {finalProducts?.map((product) => (
            <div key={product.id}>
              <CardProduct
                data={product}
                showDelete={false}
                viewType={viewType}
              />
              <BaseButton
                className={clsx(
                  'w-full mt-4',
                  viewType === 'list' && 'max-w-[300px]',
                )}
                colorText={DEFAULT_THEME.NEUTRAL_950}
                onClick={() =>
                  handleAddCompare({
                    attributeSetId: product.attributeSetId,
                    customAttributes: product.customAttributes,
                    id: product.id,
                    img: product.img,
                    properties: product.properties,
                    title: product.name,
                  })
                }
                size="extra-small"
                variant="outlined"
              >
                <IconAdd height={12} width={12} />
                <p className="font-medium text-[13px]/[17px]">
                  {t('category.compare')}{' '}
                </p>
              </BaseButton>
            </div>
          ))}
        </div>

        {shouldShowNoProducts && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-gray-900 mb-2">
              {t('shared.noProductsFound')}
            </p>
            <p className="text-sm text-gray-500 text-center">
              {t('shared.noProductsInCategory', {
                category: categoryListQuery.data.name,
              })}
            </p>
          </div>
        )}

        {!shouldEnableInfiniteScroll && activeQuery.hasNextPage && (
          <div className="w-full flex justify-center">
            <BaseButton
              className={`!rounded-[12px] !h-10 !px-8 !text-base !font-medium border border-[${DEFAULT_THEME.NEUTRAL_200}] text-[${DEFAULT_THEME.NEUTRAL_950}] bg-white shadow`}
              colorText={DEFAULT_THEME.NEUTRAL_950}
              onClick={handleStartInfiniteScroll}
              size="middle-large"
              variant="outlined"
            >
              {t('category.viewMore', { count: totalCount - currentCount })}
            </BaseButton>
          </div>
        )}

        {shouldEnableInfiniteScroll && activeQuery.hasNextPage && (
          <div className="w-full flex justify-center" ref={targetRef}>
            <BaseButton
              className={`!rounded-[12px] !h-10 !px-8 !text-base !font-medium border border-[${DEFAULT_THEME.NEUTRAL_200}] text-[${DEFAULT_THEME.NEUTRAL_950}] !bg-white shadow`}
              colorText={DEFAULT_THEME.NEUTRAL_950}
              disabled={activeQuery.isFetchingNextPage}
              onClick={handleLoadMore}
              size="middle-large"
              variant="outlined"
            >
              {t('category.loading')}
            </BaseButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
