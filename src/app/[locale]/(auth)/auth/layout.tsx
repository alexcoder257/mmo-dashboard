import '@/assets/styles/root/main.scss';

import { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';

import { AntConfigProvider } from '@/contexts/AntConfigProvider';
import { ReactQueryProvider } from '@/contexts/ReactQueryProvider';
import { routing } from '@/i18n/routing';
import { GuestLayout } from '@/layouts/GuestLayout';

export const runtime = 'edge';

interface IProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  icons: {
    icon: '/icon.svg',
  },
  title: 'Dell USA HUB',
};

const AuthLayout: React.FC<IProps> = async ({ children, params }) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html className={inter.variable} lang={locale}>
      <body>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <AntConfigProvider>
              <NextTopLoader />

              <GuestLayout>{children}</GuestLayout>
            </AntConfigProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

const inter = localFont({
  display: 'swap',
  src: [
    {
      path: '../../../../assets/fonts/inter/Inter_18pt-Regular.ttf',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../../../../assets/fonts/inter/Inter_18pt-Medium.ttf',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../../../../assets/fonts/inter/Inter_18pt-SemiBold.ttf',
      style: 'normal',
      weight: '600',
    },
    {
      path: '../../../../assets/fonts/inter/Inter_18pt-Bold.ttf',
      style: 'normal',
      weight: '700',
    },
  ],
  variable: '--font-inter',
});

export default AuthLayout;
