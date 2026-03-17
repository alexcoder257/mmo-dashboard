'use client';
import { Layout } from 'antd';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';

import CompareCountGlobal from '@/components/compare/CompareCountGlobal';
import AppModals from '@/components/shared/AppModals';
import TheFooter from '@/components/shared/TheFooter';
import { TheSubTopBar } from '@/components/shared/TheSubTopBar';
import { TheTopbar } from '@/components/shared/TheTopbar';
import { useWindowScroll } from '@/hooks/shared/use-window-scroll';

interface IProps {
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<IProps> = ({ children }) => {
  const { y } = useWindowScroll();
  const pathname = usePathname();

  const isWhiteBackground =
    pathname.includes('/news') || pathname.includes('/news/');

  const headerStyle = {
    marginTop: y > 50 ? '-20px' : '0',
    transition: 'margin-top 0.3s ease',
  };

  return (
    <div className={clsx(isWhiteBackground && 'bg-white')}>
      <Layout>
        <Layout className="!flex !flex-col !min-h-screen">
          <Layout.Header style={headerStyle}>
            <TheTopbar />
          </Layout.Header>
          <TheSubTopBar />
          <Layout.Content className="!flex-1 mx-auto max-w-[1232px] w-full px-4 sm:px-0">
            {children}
          </Layout.Content>
          <Layout.Footer>
            <TheFooter />
          </Layout.Footer>
        </Layout>
      </Layout>
      <CompareCountGlobal />
      <AppModals />
    </div>
  );
};
