'use client';

export const runtime = 'edge';

import type { MenuProps } from 'antd';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import IconAIArror from '@/assets/icons/categories/IconAIArror.svg';
import IconAIHelper from '@/assets/icons/categories/IconAIHelper.svg';
// import IconDocs from '@/assets/icons/compare/IconDocs.svg';
import IconPDF from '@/assets/icons/compare/IconPDF.svg';
import IconReferece from '@/assets/icons/compare/IconReference.svg';
// import IconText from '@/assets/icons/compare/IconText.svg';
import {
  RenderEmptyProduct,
  RenderProduct,
} from '@/components/compare/CompareDrawer';
import { CompareTable } from '@/components/compare/CompareTable';
import { BaseButton } from '@/components/shared/BaseButton';
import { BaseDropdown } from '@/components/shared/BaseDropdown';
import { MODAL_KEYS } from '@/constants/shared.const';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { useAttributeSetQuery } from '@/hooks/category/use-attribute-set-queries';
import { useModal } from '@/hooks/shared/use-modal';
import { DownloadType, EToast } from '@/models/enums/shared.enum';
import { useCompareStore } from '@/stores/compare.store';
import { ACTIVE_TAB_KEY, useNavigationStore } from '@/stores/navigation.store';
import { downloadCompareTableAsPDF } from '@/utils/pdf.util';
import { generateCompareSections } from '@/utils/product.util';
import { showToast } from '@/utils/shared.util';

const ComparePage: React.FC = () => {
  const t = useTranslations();
  const [isDownloading, setIsDownloading] = useState(false);
  const products = useCompareStore((state) => state.products);
  const removeProduct = useCompareStore((state) => state.removeProduct);
  const { open: openSearchModal } = useModal(MODAL_KEYS.SEARCH_MODAL);
  const attributeSetQuery = useAttributeSetQuery();
  const { setActiveTab } = useNavigationStore();

  const sectionsToRender = generateCompareSections(
    attributeSetQuery.data as {
      attributeSetId: number;
      attributeSetName: string;
    }[],
    products,
    products.length > 0 ? products[0].attributeSetId : undefined,
  );

  const handleRemove = (id: string) => {
    removeProduct(id);
  };
  const handleAddProduct = () => {
    openSearchModal();
  };

  const handleDownload = async ({ key }: { key: string }) => {
    if (key === DownloadType.PDF) {
      setIsDownloading(true);
      try {
        const productsForPDF = products.map((product) => ({
          id: product.id,
          img: typeof product.img === 'string' ? product.img : undefined,
          name: product.title,
          sku: product.properties?.sku || undefined,
        }));

        await downloadCompareTableAsPDF(
          'compare-table-container',
          'compare-products.pdf',
          productsForPDF,
        );
        showToast(
          t('compare.pdfDownloadSuccess'),
          EToast.Success,
          t('compare.downloadComplete'),
        );
      } catch (error) {
        console.error('Failed to download PDF:', error);
        showToast(
          t('compare.pdfDownloadError'),
          EToast.Error,
          t('compare.downloadFailed'),
        );
      } finally {
        setIsDownloading(false);
      }
    } else {
      console.info(`Downloading ${key}`);
    }
  };

  const items: MenuProps['items'] = [
    // {
    //   key: DownloadType.Docs,
    //   label: (
    //     <div className="flex items-center gap-2 font-semibold">
    //       <IconDocs className="w-5 h-5" />
    //       <span>{t('shared.fileTypes.docx')}</span>
    //     </div>
    //   ),
    // },
    // {
    //   key: DownloadType.Text,
    //   label: (
    //     <div className="flex items-center gap-2 font-semibold">
    //       <IconText className="w-5 h-5" />
    //       <span>{t('shared.fileTypes.text')}</span>
    //     </div>
    //   ),
    // },
    {
      key: DownloadType.PDF,
      label: (
        <div className="flex items-center gap-2 font-semibold">
          <IconPDF className="w-5 h-5" />
          <span>{t('shared.fileTypes.pdf')}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[#f6f6f6] min-h-screen flex flex-col items-center pt-4 pb-16 max-w-[1232px] w-full">
      <section className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl mb-6 p-4 w-full shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)]">
        <div>
          <div
            className={`font-semibold text-[20px]/[26px] mb-4 whitespace-nowrap`}
            style={{
              color: DEFAULT_THEME.NEUTRAL_950,
            }}
          >
            {t('compare.compareProducts')}
          </div>
          <div className="flex gap-3">
            <BaseDropdown
              disabled={isDownloading || products?.length < 2}
              menu={{ items, onClick: handleDownload }}
              placement="bottomLeft"
            >
              <BaseButton
                className="flex-1 sm:flex-none !border-none text-[13px]/[17px] sm:text-base"
                customColor="primary"
                loading={isDownloading}
              >
                <IconReferece />
                {isDownloading
                  ? t('shared.button.saving')
                  : t('compare.createDocument')}
              </BaseButton>
            </BaseDropdown>
            <BaseButton
              className="!bg-[#FFE3E5] flex-1 sm:!hidden !border-none"
              onClick={() => setActiveTab(ACTIVE_TAB_KEY.Ai)}
              size="middle"
            >
              <IconAIHelper height={10} width={13} />
              <span className="text-[13px]/[17px] sm:text-base font-medium text-primary_700">
                {t('compare.askAI')}
              </span>
              <IconAIArror height={14} width={14} />
            </BaseButton>
          </div>
        </div>
        <div className="flex w-full">
          {Array.from({ length: 4 }).map((_, idx) => {
            const product = products[idx];
            if (product) {
              return (
                <RenderProduct
                  className="!rounded-none gap-0"
                  key={product.id}
                  onRemove={handleRemove}
                  product={product}
                />
              );
            }
            return (
              <RenderEmptyProduct
                className="!rounded-none gap-0"
                key={`empty-${idx}`}
                onAddProduct={handleAddProduct}
              />
            );
          })}
        </div>
      </section>
      <div className="w-full" id="compare-table-container">
        {sectionsToRender.length > 0 ? (
          sectionsToRender.map((section) => (
            <CompareTable key={section.section} section={section} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-2xl">
            <p className="text-lg font-medium text-gray-900 mb-2">
              {products.length === 0
                ? t('compare.noProductsToCompare')
                : t('compare.noDataAvailable')}
            </p>
            <p className="text-sm text-gray-500 text-center">
              {products.length === 0
                ? t('compare.addProductsToStartComparison')
                : t('compare.attributeDataNotAvailable')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
