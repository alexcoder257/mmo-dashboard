'use client';

import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';

import IconAnalyzer from '@/assets/icons/shared/IconAnalyzer.svg';
import IconTiktok from '@/assets/icons/shared/IconTiktok.svg';
import { TIKTOK_PAGE, TRAVEL_PAGE } from '@/constants/route-pages.const';
import { useRouter } from '@/i18n/navigation';

const ICON_PROPS = { height: 24, width: 24 };

const QUICK_LINKS = [
  {
    description: 'Download TikTok videos easily',
    gradient:
      'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(244, 114, 182, 0.1) 100%)',
    icon: IconTiktok,
    iconColor: '#f472b6',
    key: TIKTOK_PAGE,
    title: 'TikTok Downloader',
  },
  {
    description: 'Analyze travel videos with AI',
    gradient:
      'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%)',
    icon: IconAnalyzer,
    iconColor: '#fbbf24',
    key: TRAVEL_PAGE,
    title: 'Travel Video Analyzer',
  },
];

const HomePage: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Welcome Section */}
      <div
        className="rounded-2xl p-6 sm:p-8"
        style={{
          background:
            'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(14, 165, 233, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
        }}
      >
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: 'var(--n-text-color)' }}
        >
          {t('dashboard.welcome')}
        </h1>
        <p className="text-sm sm:text-base" style={{ color: 'var(--neutrals_400)' }}>
          {t('dashboard.welcomeMessage')}
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--n-text-color)' }}
        >
          {t('dashboard.quickActions.title')}
        </h2>
        <Row gutter={[16, 16]}>
          {QUICK_LINKS.map((link) => (
            <Col key={link.key} lg={8} sm={12} xs={24}>
              <div
                className="rounded-xl p-5 cursor-pointer transition-all duration-200 h-full group"
                onClick={() => router.push(link.key)}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
                    style={{ background: link.gradient }}
                  >
                    <link.icon
                      {...ICON_PROPS}
                      style={{ color: link.iconColor, fill: link.iconColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{ color: 'var(--n-text-color)' }}
                    >
                      {link.title}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--neutrals_400)' }}
                    >
                      {link.description}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
