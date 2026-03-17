'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import stringTemplate from 'string-template';

import IconArticlesTab from '@/assets/icons/product/IconArticlesTab.svg';
import IconDocumentsTab from '@/assets/icons/product/IconDocumentsTab.svg';
import IconSpecsTab from '@/assets/icons/product/IconSpecsTab.svg';
import PreviewProduct from '@/components/product/PreviewProduct';
import ProductArticleDetail from '@/components/product/ProductArticleDetail';
import ProductDocuments from '@/components/product/ProductDocuments';
import ProductSpecification from '@/components/product/ProductSpecification';
import RelatedProduct from '@/components/product/RelatedProduct';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb';
import { BaseButton } from '@/components/shared/BaseButton';
import { CATEGORY_PAGE, HOME_PAGE } from '@/constants/route-pages.const';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { useProductAttributes } from '@/hooks/product/use-product-attributes';
import {
  useProductDetail,
  useProductRelateds,
} from '@/hooks/product/use-product-queries';
import {
  EProdInfomationType,
  EProductBaseAttributeCode,
} from '@/models/enums/product.enum';
import {
  IProduct,
  IProductDocument,
} from '@/models/interfaces/product.interface';
import { TCategoryFlatten } from '@/models/types/category.type';
import { useCategoryStore } from '@/stores/category.store';
import { useRecentlyViewedStore } from '@/stores/recently-viewed';
import { getCategoryByIds } from '@/utils/category.util';
import {
  extractSpecificationsFromAttributes,
  getProductDocuments,
} from '@/utils/product.util';

const ProductDetailPage: React.FC = () => {
  const { categories } = useCategoryStore();
  const { productId } = useParams();
  const t = useTranslations();

  const tabs = [
    {
      icon: <IconSpecsTab height={16} width={21} />,
      label: t('products.specifications'),
      value: EProdInfomationType.Specifications,
    },
    {
      icon: <IconArticlesTab height={14} width={19} />,
      label: t('products.articles'),
      value: EProdInfomationType.Articles,
    },
    {
      icon: <IconDocumentsTab height={16} width={14} />,
      label: t('products.documents'),
      value: EProdInfomationType.Documents,
    },
  ];
  const productDetailQuery = useProductDetail(productId as string);
  const productRelatedsQuery = useProductRelateds(
    productDetailQuery.data?.productLinks?.map(
      (link) => link.linkedProductSku,
    ) || [],
  );

  const addRecentlyViewed = useRecentlyViewedStore(
    (state) => state.addRecentlyViewed,
  );

  const { getProductAttribute } = useProductAttributes(
    productDetailQuery.data?.customAttributes || [],
  );
  const [category, setCategory] = useState<null | TCategoryFlatten>(null);
  const [documents, setDocuments] = useState<IProductDocument[]>([]);
  const [activeTab, setActiveTab] = useState(
    EProdInfomationType.Specifications,
  );
  const hasFetchedDocuments = useRef(false);

  const shortDescription = getProductAttribute(
    EProductBaseAttributeCode.ShortDescription,
  );
  const specifications = extractSpecificationsFromAttributes(
    productDetailQuery.data?.customAttributes || [],
  );

  const description = getProductAttribute(
    EProductBaseAttributeCode.Description,
  );

  const getCategory = async (
    productData: IProduct | undefined,
    categories: TCategoryFlatten[],
  ) => {
    if (!productData || categories.length === 0) return;

    const categoryAttr = getProductAttribute(
      EProductBaseAttributeCode.CategoryIds,
    );
    const categoryIds = (categoryAttr?.value as string[]) || [];

    const category = getCategoryByIds(categoryIds, categories);

    setCategory(category);
  };

  const fetchDocuments = async (productId: string) => {
    const documents = await getProductDocuments([productId]);
    setDocuments(documents || []);
  };

  useEffect(() => {
    if (!productDetailQuery.data?.id || hasFetchedDocuments.current) return;

    hasFetchedDocuments.current = true;

    fetchDocuments(String(productDetailQuery.data.id));
  }, [productDetailQuery.data?.id]);

  useEffect(() => {
    getCategory(productDetailQuery.data, categories || []);
  }, [productDetailQuery.data, categories]);

  useEffect(() => {
    if (productDetailQuery.data?.sku) {
      addRecentlyViewed(productDetailQuery.data.sku, 'product');
    }
  }, [productDetailQuery.data?.sku]);

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <div className="max-w-[1232px] mx-auto">
        <div className="flex flex-col items-center gap-4 sm:gap-4">
          <div className="w-full sm:mt-8 mt-2">
            <BaseBreadcrumb
              items={[
                { href: HOME_PAGE, label: t('shared.navigator.home') },
                {
                  href: stringTemplate(CATEGORY_PAGE, {
                    id: category?.id,
                  }),
                  label: category?.name || '',
                },
                { label: productDetailQuery.data?.name || '' },
              ]}
            />
          </div>
          <PreviewProduct
            isLoading={productDetailQuery.isPending}
            product={productDetailQuery.data!}
          />
          <div className="flex flex-col gap-12 w-full">
            <div className="bg-white rounded-2xl w-full">
              <div className="flex justify-between sm:justify-center items-center sm:gap-8 sm:px-6 sm:pt-6 sm:pb-2 p-2">
                {tabs.map((tab) => (
                  <BaseButton
                    className={`!border-none flex flex-col sm:flex-row !h-[53px] !px-2 sm:!px-4 ${
                      activeTab === tab.value ? '!bg-[#FFE3E5]' : '!bg-white'
                    }`}
                    colorText={
                      activeTab === tab.value
                        ? DEFAULT_THEME.PRIMARY
                        : DEFAULT_THEME.NEUTRAL_950
                    }
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.icon}
                    <p
                      className="text-[13px]/[17px] sm:text-[16px]/[21px]"
                      style={{
                        color:
                          activeTab === tab.value
                            ? DEFAULT_THEME.PRIMARY
                            : DEFAULT_THEME.NEUTRAL_950,
                      }}
                    >
                      {tab.label}
                    </p>
                  </BaseButton>
                ))}
              </div>
              {activeTab === EProdInfomationType.Specifications && (
                <ProductSpecification
                  description={(shortDescription?.value as string) || ''}
                  isLoading={productDetailQuery.isPending}
                  specifications={specifications}
                />
              )}
              {activeTab === EProdInfomationType.Articles && (
                <ProductArticleDetail
                  articleDetail={(description?.value as string) || ''}
                />
              )}
              {activeTab === EProdInfomationType.Documents && (
                <ProductDocuments documents={documents || []} />
              )}
            </div>
            <RelatedProduct
              isLoading={productDetailQuery.isPending}
              productRelateds={productRelatedsQuery.data || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
