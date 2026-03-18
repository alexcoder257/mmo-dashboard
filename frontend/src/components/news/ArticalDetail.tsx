// TODO: implement — stub for build compatibility
'use client';

import React from 'react';

interface IProps {
  newsId?: string;
}

const ArticalDetail: React.FC<IProps> = ({ newsId: _newsId }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-64 bg-gray-200 rounded mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};

export default ArticalDetail;
