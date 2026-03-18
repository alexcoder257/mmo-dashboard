// TODO: implement — stub for build compatibility
import React from 'react';

import { IArticleItem } from '@/models/interfaces/article.interface';

interface IProps {
  article: IArticleItem;
  className?: string;
}

const MainNews: React.FC<IProps> = ({ article, className }) => {
  return (
    <div className={`rounded-xl overflow-hidden bg-white shadow-sm ${className ?? ''}`}>
      {article.image && (
        <div className="relative w-full h-64 bg-gray-100">
          <img
            alt={article.name}
            className="w-full h-full object-cover"
            src={article.image}
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="font-bold text-2xl line-clamp-2 mb-3">{article.name}</h2>
        {article.shortDescription && (
          <p className="text-gray-600 line-clamp-4">{article.shortDescription}</p>
        )}
      </div>
    </div>
  );
};

export default MainNews;
