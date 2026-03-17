import '@/assets/styles/root/main.scss';

import { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';

import { AntConfigProvider } from '@/contexts/AntConfigProvider';
import { routing } from '@/i18n/routing';

export const runtime = 'edge';

interface IProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Error',
};

const ErrorLayout: React.FC<IProps> = async ({ children, params }) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html className={plusJakartaSans.variable} lang={locale}>
      <head>
        <link href="/IconNext.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <NextIntlClientProvider>
          <NextTopLoader />

          <AntConfigProvider>{children}</AntConfigProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

const plusJakartaSans = localFont({
  display: 'swap',
  src: [
    {
      path: '../../../assets/fonts/plus-jakarta-sans/PlusJakartaSans-VariableFont_wght.ttf',
      style: 'normal',
      weight: '200 800',
    },
    {
      path: '../../../assets/fonts/plus-jakarta-sans/PlusJakartaSans-Italic-VariableFont_wght.ttf',
      style: 'italic',
      weight: '200 800',
    },
  ],
  variable: '--n-plus-jakarta-sans',
});

export default ErrorLayout;
