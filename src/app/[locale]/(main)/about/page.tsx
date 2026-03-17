'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IconLogo from '@/assets/icons/shared/IconLogo.svg';
import dummyBanner from '@/assets/images/shared/dummy-banner.png';
import { BaseButton } from '@/components/shared/BaseButton';
import { HOME_PAGE } from '@/constants/route-pages.const';
import { Link } from '@/i18n/navigation';

const AboutPage: React.FC = () => {
  const t = useTranslations();

  const values = [
    {
      description: t('about.values.innovation.description'),
      icon: '💡',
      title: t('about.values.innovation.title'),
    },
    {
      description: t('about.values.trust.description'),
      icon: '🤝',
      title: t('about.values.trust.title'),
    },
    {
      description: t('about.values.customer.description'),
      icon: '🎯',
      title: t('about.values.customer.title'),
    },
    {
      description: t('about.values.quality.description'),
      icon: '⭐',
      title: t('about.values.quality.title'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          alt="About Us Banner"
          className="object-cover"
          fill
          priority
          src={dummyBanner}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">{t('about.subtitle')}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              {t('about.mission.title')}
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              {t('about.mission.description')}
            </p>
            <p className="text-lg text-gray-700">
              {t('about.mission.commitment')}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="bg-primary_100 rounded-2xl p-12 flex items-center justify-center">
              <IconLogo className="w-64 h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('about.values.title')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              key={index}
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('about.story.title')}</h2>
          <p className="text-lg text-gray-700 mb-6">
            {t('about.story.paragraph1')}
          </p>
          <p className="text-lg text-gray-700 mb-6">
            {t('about.story.paragraph2')}
          </p>
          <p className="text-lg text-gray-700">{t('about.story.paragraph3')}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-primary_700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('about.cta.title')}</h2>
          <p className="text-xl mb-8">{t('about.cta.description')}</p>
          <Link href={HOME_PAGE}>
            <BaseButton
              className="!bg-white !text-primary_700"
              size="large"
              variant="filled"
            >
              {t('about.cta.button')}
            </BaseButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
