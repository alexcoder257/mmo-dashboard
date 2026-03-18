// TODO: implement — stub for build compatibility
'use client';

import React from 'react';

import { IProduct } from '@/models/interfaces/product.interface';
import { useRecentlyViewedStore } from '@/stores/recently-viewed';

interface IProps {
  className?: string;
}

const ViewedHistory: React.FC<IProps> = ({ className }) => {
  const { recentlyViewed } = useRecentlyViewedStore();

  if (!recentlyViewed?.length) return null;

  return (
    <div className={`w-full py-8 ${className ?? ''}`}>
      <h2 className="text-xl font-bold mb-4">{'Recently Viewed'}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {recentlyViewed.map((item, i) => {
          const product = item.data as IProduct | null;
          return (
            <div
              className="flex-shrink-0 w-40 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              key={i}
            >
              <div className="h-28 bg-gray-100" />
              <div className="p-2">
                <p className="text-xs font-medium line-clamp-2">
                  {product?.name ?? ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewedHistory;
