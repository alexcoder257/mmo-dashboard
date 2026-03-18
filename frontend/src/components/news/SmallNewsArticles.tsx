// TODO: implement — stub for build compatibility
import React from 'react';

import { IArticleItem } from '@/models/interfaces/article.interface';

interface IProps {
  articles: IArticleItem[];
  className?: string;
}

const SmallNewsArticles: React.FC<IProps> = ({ articles, className }) => {
  return (
    <div className={`flex flex-col gap-4 ${className ?? ''}`}>
      {articles.map((article) => (
        <div
          className="flex gap-3 rounded-lg overflow-hidden bg-white shadow-sm p-3"
          key={article.postId}
        >
          {article.image && (
            <img
              alt={article.name}
              className="w-24 h-16 object-cover rounded flex-shrink-0"
              src={article.image}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2">{article.name}</h3>
            {article.shortDescription && (
              <p className="text-gray-500 text-xs line-clamp-2 mt-1">
                {article.shortDescription}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmallNewsArticles;
