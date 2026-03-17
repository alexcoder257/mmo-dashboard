'use client';

import { Modal, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

import { BaseButton } from '@/components/shared/BaseButton';
import { useCompareStore } from '@/stores/compare.store';

export const CompareAIModal: React.FC = () => {
  const t = useTranslations();
  const { aiInsights, isAIModalOpen, setAIModalOpen } = useCompareStore();

  const handleClose = () => {
    setAIModalOpen(false);
  };

  return (
    <Modal
      footer={[
        <BaseButton key="close" onClick={handleClose}>
          {t('shared.button.ok')}
        </BaseButton>,
      ]}
      onCancel={handleClose}
      open={isAIModalOpen}
      title={t('compare.aiInsights')}
      width={600}
    >
      <div className="py-4">
        {aiInsights ? (
          <div className="prose prose-sm max-w-none">
            {aiInsights.split('\n').map((line, index) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <h4 className="font-semibold text-lg mt-4 mb-2" key={index}>
                    {line.replace(/\*\*/g, '')}
                  </h4>
                );
              } else if (line.startsWith('- ')) {
                return (
                  <li className="ml-4 list-disc" key={index}>
                    {line.substring(2)}
                  </li>
                );
              } else if (line.trim()) {
                return (
                  <p className="mb-2" key={index}>
                    {line}
                  </p>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">
              {t('compare.analyzingProducts')}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
