import { Metadata } from 'next';

export const runtime = 'edge';

import BannerHomePage from '@/components/home/BannerHomePage';
import CategoriesHomePage from '@/components/home/CategoriesHomePage';
import DailyMissions from '@/components/home/DailyMissions/index';
import ProductBanner from '@/components/home/ProductBanner';
import ViewedHistory from '@/components/home/ViewedHistory';

export const metadata: Metadata = {
  title: 'MMO Dashboard',
};

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 sm:gap-12 my-6 sm:my-[64px]">
      <BannerHomePage />
      <ViewedHistory />
      <DailyMissions />
      <ProductBanner />
      <CategoriesHomePage />
    </div>
  );
};

export default HomePage;
