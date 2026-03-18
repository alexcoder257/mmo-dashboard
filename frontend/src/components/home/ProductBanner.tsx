// TODO: implement — stub for build compatibility
import React from 'react';

interface IProps {
  className?: string;
}

const ProductBanner: React.FC<IProps> = ({ className }) => {
  return (
    <div className={`w-full py-8 ${className ?? ''}`}>
      <h2 className="text-xl font-bold mb-4">{'Featured Products'}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            key={i}
          >
            <div className="h-40 bg-gray-100" />
            <div className="p-3">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductBanner;
