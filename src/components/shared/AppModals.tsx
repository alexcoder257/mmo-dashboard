import React from 'react';

import { CompareDrawer } from '@/components/compare/CompareDrawer';
import SearchModal from '@/components/modals/SearchModal';
import { CompareAIModal } from '@/components/shared/CompareAIModal';
import { MODAL_KEYS } from '@/constants/shared.const';
import { useModalStore } from '@/stores/modal.store';

const AppModals: React.FC = () => {
  const { hasModalOpen } = useModalStore();

  return (
    <>
      {hasModalOpen(MODAL_KEYS.SEARCH_MODAL) && <SearchModal />}
      {hasModalOpen(MODAL_KEYS.COMPARE_MODAL) && <CompareDrawer />}
      <CompareAIModal />
    </>
  );
};

export default AppModals;
