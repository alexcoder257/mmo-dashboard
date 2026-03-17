'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import IconCategory from '@/assets/icons/shared/IconCategory.svg';
import IconDashboard from '@/assets/icons/shared/IconDashboard.svg';
import IconEye from '@/assets/icons/shared/IconEye.svg';
import IconHistory from '@/assets/icons/shared/IconHistory.svg';
import IconStar from '@/assets/icons/shared/IconStar.svg';
import CardProduct from '@/components/product/CardProduct';
import { BaseButton } from '@/components/shared/BaseButton';
import { AI_ASSISTANT_PAGE, HOME_PAGE } from '@/constants/route-pages.const';
import { Link } from '@/i18n/navigation';
import { products as productListMock } from '@/mocks/home-page.mock';

const DashboardPage: React.FC = () => {
  const t = useTranslations();
  const [recentProducts] = useState(
    productListMock.slice(0, 4).map((product) => ({
      ...product,
      attributeSetId: 1,
      img: product.img?.src || '/placeholder-product.png',
      name: product.title,
      sku: `SKU-${product.id}`,
    })),
  );
  const [favoriteProducts] = useState(
    productListMock.slice(2, 6).map((product) => ({
      ...product,
      attributeSetId: 1,
      img: product.img?.src || '/placeholder-product.png',
      name: product.title,
      sku: `SKU-${product.id}`,
    })),
  );

  const stats = [
    {
      change: '+12%',
      changeType: 'increase' as const,
      icon: <IconEye className="w-6 h-6" />,
      title: t('dashboard.stats.productsViewed'),
      value: '156',
    },
    {
      change: '+5%',
      changeType: 'increase' as const,
      icon: <IconCategory className="w-6 h-6" />,
      title: t('dashboard.stats.comparisons'),
      value: '24',
    },
    {
      change: '-2%',
      changeType: 'decrease' as const,
      icon: <IconStar className="w-6 h-6" />,
      title: t('dashboard.stats.savedItems'),
      value: '38',
    },
    {
      change: '+18%',
      changeType: 'increase' as const,
      icon: <IconHistory className="w-6 h-6" />,
      title: t('dashboard.stats.searchHistory'),
      value: '89',
    },
  ];

  const recentActivity = [
    {
      action: t('dashboard.activity.viewed'),
      icon: <IconEye className="w-4 h-4" />,
      id: 1,
      item: 'Dell XPS 15',
      time: '2 hours ago',
    },
    {
      action: t('dashboard.activity.compared'),
      icon: <IconCategory className="w-4 h-4" />,
      id: 2,
      item: 'MacBook Pro vs Dell XPS',
      time: '5 hours ago',
    },
    {
      action: t('dashboard.activity.saved'),
      icon: <IconStar className="w-4 h-4" />,
      id: 3,
      item: 'ASUS ROG Gaming Laptop',
      time: 'Yesterday',
    },
    {
      action: t('dashboard.activity.searched'),
      icon: <IconHistory className="w-4 h-4" />,
      id: 4,
      item: 'Gaming keyboards',
      time: '2 days ago',
    },
  ];

  const quickActions = [
    {
      color: 'bg-blue-100',
      description: t('dashboard.quickActions.browseCategoriesDesc'),
      href: HOME_PAGE,
      icon: <IconCategory className="w-8 h-8" />,
      title: t('dashboard.quickActions.browseCategories'),
    },
    {
      color: 'bg-green-100',
      description: t('dashboard.quickActions.compareProductsDesc'),
      href: '/compare',
      icon: <IconCategory className="w-8 h-8" />,
      title: t('dashboard.quickActions.compareProducts'),
    },
    {
      color: 'bg-purple-100',
      description: t('dashboard.quickActions.aiAssistantDesc'),
      href: AI_ASSISTANT_PAGE,
      icon: <IconDashboard className="w-8 h-8" />,
      title: t('dashboard.quickActions.aiAssistant'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <IconDashboard className="w-8 h-8" />
        {t('dashboard.title')}
      </h1>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary_600 to-primary_700 text-white rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">{t('dashboard.welcome')}</h2>
        <p className="opacity-90">{t('dashboard.welcomeMessage')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div className="bg-white rounded-xl p-6 shadow-sm" key={index}>
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${stat.changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'}`}
              >
                {stat.icon}
              </div>
              <span
                className={`text-sm font-semibold ${
                  stat.changeType === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
            <h2 className="text-lg font-semibold mb-4">
              {t('dashboard.recentActivity')}
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  className="flex items-start gap-3 pb-4 border-b last:border-0"
                  key={activity.id}
                >
                  <div className="p-2 bg-gray-100 rounded-lg mt-1">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>{' '}
                      <span className="text-gray-700">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
            <h2 className="text-lg font-semibold mb-4">
              {t('dashboard.quickActions.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link href={action.href} key={index}>
                  <div className="border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div
                      className={`${action.color} w-16 h-16 rounded-lg flex items-center justify-center mb-3`}
                    >
                      {action.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Products */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {t('dashboard.recentlyViewed')}
            </h2>
            <Link href={HOME_PAGE}>
              <BaseButton size="small" variant="outlined">
                {t('dashboard.viewAll')}
              </BaseButton>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentProducts.map((product) => (
              <CardProduct data={product} key={product.id} />
            ))}
          </div>
        </div>
      </div>

      {/* Favorite Products */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {t('dashboard.favoriteProducts')}
            </h2>
            <Link href={HOME_PAGE}>
              <BaseButton size="small" variant="outlined">
                {t('dashboard.viewAll')}
              </BaseButton>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favoriteProducts.map((product) => (
              <CardProduct data={product} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
