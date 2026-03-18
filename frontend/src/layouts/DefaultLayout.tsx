'use client';
import { Drawer, Layout } from 'antd';

import { TheSidebar } from '@/components/shared/TheSidebar';
import { TheTopbar } from '@/components/shared/TheTopbar';
import useScreen from '@/hooks/shared/use-screen';
import { useNavigationStore } from '@/stores/navigation.store';

interface IProps {
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export const DefaultLayout: React.FC<IProps> = ({ children }) => {
  const isMobile = useScreen();
  const { isSidebarCollapsed, setSidebarCollapsed } = useNavigationStore();

  const siderWidth = isSidebarCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_WIDTH;

  return (
    <Layout style={{ background: 'var(--n-background-body-color)', minHeight: '100vh' }}>
      {isMobile ? (
        <Drawer
          bodyStyle={{ background: 'var(--sidebar-bg)', padding: 0 }}
          closable={false}
          onClose={() => setSidebarCollapsed(true)}
          open={!isSidebarCollapsed}
          placement="left"
          width={SIDEBAR_WIDTH}
        >
          <TheSidebar />
        </Drawer>
      ) : (
        <Layout.Sider
          collapsed={isSidebarCollapsed}
          collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
          onCollapse={setSidebarCollapsed}
          style={{
            background: 'var(--sidebar-bg)',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            height: '100vh',
            left: 0,
            overflow: 'auto',
            position: 'fixed',
            top: 0,
          }}
          theme="dark"
          trigger={null}
          width={SIDEBAR_WIDTH}
        >
          <TheSidebar />
        </Layout.Sider>
      )}

      <Layout
        style={{
          background: 'var(--n-background-body-color)',
          marginLeft: isMobile ? 0 : siderWidth,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <Layout.Header
          style={{
            background: 'var(--topbar-bg)',
            height: 56,
            lineHeight: '56px',
            padding: 0,
          }}
        >
          <TheTopbar />
        </Layout.Header>

        <Layout.Content
          className="p-4 sm:p-6"
          style={{
            background: 'var(--n-background-body-color)',
            minHeight: 'calc(100vh - 56px)',
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
