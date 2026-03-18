// TODO: implement — stub for build compatibility
import React from 'react';

interface INewsCardArticle {
  author?: string;
  description?: string;
  id: string;
  image?: string;
  timeAgo?: string;
  title: string;
}

interface IProps {
  article: INewsCardArticle;
  className?: string;
  onClick?: () => void;
}

export const NewsCard: React.FC<IProps> = ({ article, className, onClick }) => {
  return (
    <div
      className={`rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className ?? ''}`}
      onClick={onClick}
    >
      {article.image && (
        <div className="relative w-full h-48 bg-gray-100">
          <img
            alt={article.title}
            className="w-full h-full object-cover"
            src={article.image}
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2">{article.title}</h3>
        {article.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{article.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-400">
          {article.author && <span>{article.author}</span>}
          {article.timeAgo && <span>{article.timeAgo}</span>}
        </div>
      </div>
    </div>
  );
};
