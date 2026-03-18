// TODO: implement — stub for build compatibility
'use client';

import React from 'react';

import { ICardProduct } from '@/models/interfaces/product.interface';
import { TViewType } from '@/models/types/product.type';

interface IProps {
  className?: string;
  data: ICardProduct;
  onClick?: () => void;
  onCompare?: () => void;
  showDelete?: boolean;
  viewType?: TViewType;
}

const CardProduct: React.FC<IProps> = ({
  className,
  data: product,
  onClick,
  viewType = 'grid',
}) => {
  const isList = viewType === 'list';

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        isList ? 'flex gap-4 p-4' : 'flex flex-col'
      } ${className ?? ''}`}
      onClick={onClick}
    >
      <div
        className={`bg-gray-100 flex items-center justify-center ${
          isList ? 'w-32 h-24 flex-shrink-0 rounded-lg' : 'w-full h-48'
        }`}
      >
        {product.img ? (
          <img
            alt={product.name}
            className="w-full h-full object-cover"
            src={product.img}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded" />
        )}
      </div>
      <div className={`p-4 flex flex-col flex-1 ${isList ? 'p-0' : ''}`}>
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex flex-wrap gap-1 mt-auto">
          {Object.entries(product.properties)
            .slice(0, 3)
            .map(([key, value]) => (
              <span
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                key={key}
              >
                {value}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
