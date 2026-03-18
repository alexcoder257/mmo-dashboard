import React, { Suspense } from 'react';

export const runtime = 'edge';

import ArticalDetail from '@/components/news/ArticalDetail';

const NewsDetailPage: React.FC = () => {
  return (
    <Suspense fallback={<div>{'Loading...'}</div>}>
      <ArticalDetail />
    </Suspense>
  );
};

export default NewsDetailPage;
