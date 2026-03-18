// TODO: implement — stub for build compatibility
'use client';

import React from 'react';

import { BaseModal } from '@/components/shared/BaseModal';
import { MODAL_KEYS } from '@/constants/shared.const';
import { useModal } from '@/hooks/shared/use-modal';

const SearchModal: React.FC = () => {
  const { close, isOpen } = useModal(MODAL_KEYS.SEARCH_MODAL);

  return (
    <BaseModal onCancel={close} open={isOpen} title="Search">
      <div className="py-4">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_500"
          placeholder="Search products, news..."
          type="text"
        />
      </div>
    </BaseModal>
  );
};

export default SearchModal;
