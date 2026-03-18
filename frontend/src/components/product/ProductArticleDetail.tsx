// TODO: implement — stub for build compatibility
import React from 'react';

import { IArticleItem } from '@/models/interfaces/article.interface';

interface IProps {
  articles?: IArticleItem[];
  className?: string;
  productName?: string;
}

const ProductArticleDetail: React.FC<IProps> = ({ articles = [] }) => {
  return (
    <div className="bg-white rounded-xl p-6">
      {articles.length === 0 ? (
        <p className="text-gray-400 text-center py-8">{'No articles available'}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <div
              className="border-b border-gray-100 pb-4 last:border-0"
              key={article.postId}
            >
              <h3 className="font-semibold mb-1">{article.name}</h3>
              {article.shortDescription && (
                <p className="text-gray-600 text-sm line-clamp-3">
                  {article.shortDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductArticleDetail;
