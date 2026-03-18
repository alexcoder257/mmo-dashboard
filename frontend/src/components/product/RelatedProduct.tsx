// TODO: implement — stub for build compatibility
import React from 'react';

import { IProduct } from '@/models/interfaces/product.interface';

interface IProps {
  className?: string;
  products?: IProduct[];
}

const RelatedProduct: React.FC<IProps> = ({ products = [] }) => {
  if (!products.length) return null;

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-4">{'Related Products'}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            className="border border-gray-200 rounded-lg p-3 hover:border-primary_700 transition-colors cursor-pointer"
            key={product.id}
          >
            <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
              <span className="text-xs text-gray-400">{product.sku}</span>
            </div>
            <p className="text-xs font-medium line-clamp-2">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
