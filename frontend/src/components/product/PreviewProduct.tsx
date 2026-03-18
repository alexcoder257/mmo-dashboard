// TODO: implement — stub for build compatibility
import React from 'react';

import { IProduct } from '@/models/interfaces/product.interface';

interface IProps {
  className?: string;
  product?: IProduct;
}

const PreviewProduct: React.FC<IProps> = ({ product }) => {
  if (!product) return <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;

  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <div className="flex gap-4">
        {product.mediaGalleryEntries?.slice(0, 1).map((entry) => (
          <img
            alt={entry.label || product.name}
            className="w-64 h-64 object-contain bg-gray-50 rounded-lg"
            key={entry.id}
            src={entry.file}
          />
        ))}
        <div>
          <p className="text-gray-500 text-sm">{'SKU: '}{product.sku}</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewProduct;
