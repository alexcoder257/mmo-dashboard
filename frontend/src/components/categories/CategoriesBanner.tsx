// TODO: implement — stub for build compatibility
import React from 'react';

import { ICategory } from '@/models/interfaces/category.interface';

interface IProps {
  categories?: ICategory[];
  className?: string;
  selectedId?: null | number | string;
}

const CategoriesBanner: React.FC<IProps> = ({ categories = [], className, selectedId }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {categories.map((cat) => (
        <div
          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer border transition-colors ${
            selectedId === cat.id
              ? 'bg-primary_700 text-white border-primary_700'
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary_700'
          }`}
          key={cat.id}
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
};

export default CategoriesBanner;
