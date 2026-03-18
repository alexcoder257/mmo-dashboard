// TODO: implement — stub for build compatibility
'use client';

import React from 'react';

import BaseDrawer from '@/components/shared/BaseDrawer';
import { MODAL_KEYS } from '@/constants/shared.const';
import { useModal } from '@/hooks/shared/use-modal';
import { CompareProduct, useCompareStore } from '@/stores/compare.store';

interface IRenderProductProps {
  className?: string;
  onRemove?: (id: string) => void;
  product: CompareProduct;
}

export const RenderProduct: React.FC<IRenderProductProps> = ({
  className,
  onRemove,
  product,
}) => (
  <div
    className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg ${className ?? ''}`}
  >
    <div className="flex items-center gap-2">
      {typeof product.img === 'string' && product.img && (
        <img
          alt={product.title}
          className="w-10 h-10 object-contain"
          src={product.img}
        />
      )}
      <span className="text-sm font-medium line-clamp-2">{product.title}</span>
    </div>
    {onRemove && (
      <button
        className="text-gray-400 hover:text-red-500 transition-colors p-1"
        onClick={() => onRemove(product.id)}
        type="button"
      >
        {'✕'}
      </button>
    )}
  </div>
);

interface IRenderEmptyProductProps {
  className?: string;
  onAddProduct?: () => void;
}

export const RenderEmptyProduct: React.FC<IRenderEmptyProductProps> = ({
  className,
  onAddProduct,
}) => (
  <div
    className={`flex items-center justify-center p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${className ?? ''}`}
    onClick={onAddProduct}
  >
    <span className="text-gray-400 text-sm">{'+ Add product'}</span>
  </div>
);

export const CompareDrawer: React.FC = () => {
  const { close, isOpen } = useModal(MODAL_KEYS.COMPARE_MODAL);
  const { products } = useCompareStore();

  return (
    <BaseDrawer onClose={close} open={isOpen}>
      <div className="flex flex-col gap-4 p-4">
        {products.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            {'No products selected for comparison'}
          </p>
        ) : (
          products.map((product) => (
            <div
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
              key={product.id}
            >
              {product.img && typeof product.img === 'string' && (
                <img
                  alt={product.title}
                  className="w-16 h-16 object-contain bg-gray-50 rounded"
                  src={product.img}
                />
              )}
              <div>
                <p className="font-medium text-sm">{product.title}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </BaseDrawer>
  );
};
