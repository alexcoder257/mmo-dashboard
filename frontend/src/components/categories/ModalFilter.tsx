// TODO: implement — stub for build compatibility
import React from 'react';

import { BaseModal } from '@/components/shared/BaseModal';

interface IProps {
  categoryId?: null | number | string;
  className?: string;
  isLoading?: boolean;
  onClose?: () => void;
  onFilteredProductsChange?: (selected: TSelectOptions) => Promise<void> | void;
  onResetFilter?: () => void;
  open?: boolean;
  productsCount?: number;
}

type TSelectOptions = Record<string, null | string>;

const ModalFilter: React.FC<IProps> = ({
  isLoading: _isLoading,
  onClose,
  open = false,
  productsCount: _productsCount,
}) => {
  return (
    <BaseModal onCancel={onClose} open={open} title="Filter">
      <div className="py-4 text-gray-500 text-center">{'Filter options coming soon'}</div>
    </BaseModal>
  );
};

export default ModalFilter;
