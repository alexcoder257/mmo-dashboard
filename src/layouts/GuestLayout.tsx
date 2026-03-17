'use client';
import { Layout } from 'antd';

import background from '@/assets/images/authentication/background.png';
import AppModals from '@/components/shared/AppModals';
import TheFooter from '@/components/shared/TheFooter';
import { TheSubTopBar } from '@/components/shared/TheSubTopBar';
import { TheTopbar } from '@/components/shared/TheTopbar';
import useScreen from '@/hooks/shared/use-screen';
import { useWindowScroll } from '@/hooks/shared/use-window-scroll';
interface IProps {
  children: React.ReactNode;
}

export const GuestLayout: React.FC<IProps> = ({ children }) => {
  const { y } = useWindowScroll();
  const isMobile = useScreen();

  const headerStyle = {
    marginTop: y > 50 ? '-20px' : '0',
    transition: 'margin-top 0.3s ease',
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${isMobile ? 'bg-white' : 'bg-cover bg-center'}`}
      style={
        !isMobile ? { backgroundImage: `url(${background.src})` } : undefined
      }
    >
      <Layout.Header style={headerStyle}>
        <TheTopbar />
      </Layout.Header>
      <TheSubTopBar />
      <Layout.Content className="!flex-1 mx-auto max-w-[1232px] w-full px-4 sm:px-0">
        {children}
      </Layout.Content>
      {!isMobile && (
        <Layout.Footer>
          <TheFooter />
        </Layout.Footer>
      )}
      <AppModals />
    </div>
  );
};
