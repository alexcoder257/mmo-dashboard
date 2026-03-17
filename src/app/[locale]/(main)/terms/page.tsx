'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';

const TermsPage: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('terms.title')}</h1>
      <p className="text-gray-600 mb-8">
        {t('terms.lastUpdated', { date: 'January 1, 2025' })}
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.introduction.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.introduction.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.acceptanceOfTerms.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.acceptanceOfTerms.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.useOfWebsite.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('terms.sections.useOfWebsite.content')}
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>{t('terms.sections.useOfWebsite.item1')}</li>
            <li>{t('terms.sections.useOfWebsite.item2')}</li>
            <li>{t('terms.sections.useOfWebsite.item3')}</li>
            <li>{t('terms.sections.useOfWebsite.item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.productInformation.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.productInformation.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.pricing.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.pricing.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.userAccounts.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.userAccounts.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.privacy.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.privacy.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.intellectualProperty.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.intellectualProperty.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.disclaimer.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.disclaimer.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.limitationOfLiability.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.limitationOfLiability.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.governingLaw.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.governingLaw.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.changes.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.changes.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t('terms.sections.contact.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('terms.sections.contact.content')}
          </p>
          <div className="mt-4 text-gray-700">
            <p>{'MMO Dashboard'}</p>
            <p>{'Email: legal@mmo-dashboard.com'}</p>
            <p>{'Phone: +84 96 573 8291'}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
