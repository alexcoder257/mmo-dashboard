import '@/assets/styles/root/main.scss';

import { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';

import { AntConfigProvider } from '@/contexts/AntConfigProvider';
import { ReactQueryProvider } from '@/contexts/ReactQueryProvider';
import { routing } from '@/i18n/routing';
import { DefaultLayout } from '@/layouts/DefaultLayout';

export const runtime = 'edge';

interface IProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
  },
  title: 'MMO Dashboard',
};

const RootLayout: React.FC<IProps> = async ({ children, params }) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html className={`${inter.variable} dark`} lang={locale}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('n_theme');if(t!==null&&JSON.parse(t)===false){document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <AntConfigProvider>
              <NextTopLoader color="#4f46e5" />

              <DefaultLayout>{children}</DefaultLayout>
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
      path: '../../../assets/fonts/inter/Inter_18pt-Regular.ttf',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../../../assets/fonts/inter/Inter_18pt-Medium.ttf',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../../../assets/fonts/inter/Inter_18pt-SemiBold.ttf',
      style: 'normal',
      weight: '600',
    },
    {
      path: '../../../assets/fonts/inter/Inter_18pt-Bold.ttf',
      style: 'normal',
      weight: '700',
    },
  ],
  variable: '--font-inter',
});

export default RootLayout;
