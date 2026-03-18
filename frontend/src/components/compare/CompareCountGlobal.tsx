// TODO: implement — stub for build compatibility
'use client';

import React from 'react';

import { MODAL_KEYS } from '@/constants/shared.const';
import { useModal } from '@/hooks/shared/use-modal';
import { useCompareStore } from '@/stores/compare.store';

const CompareCountGlobal: React.FC = () => {
  const { products } = useCompareStore();
  const { open } = useModal(MODAL_KEYS.COMPARE_MODAL);

  if (!products.length) return null;

  return (
    <button
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary_700 text-white px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
      onClick={() => open()}
      type="button"
    >
      <span className="font-semibold">{'Compare'}</span>
      <span className="flex items-center justify-center w-6 h-6 bg-white text-primary_700 rounded-full text-xs font-bold">
        {products.length}
      </span>
    </button>
  );
};

export default CompareCountGlobal;
