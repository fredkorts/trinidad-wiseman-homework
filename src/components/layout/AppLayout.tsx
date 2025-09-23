// AppLayout composes the sidebar and mobile header around the routed page content
// and coordinates sidebar visibility across desktop and mobile breakpoints.
import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/constants';

const SIDEBAR_ID = 'app-sidebar';

export default function AppLayout() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.MOBILE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <Layout className="tw-layout">
      <Sidebar
        id={SIDEBAR_ID}
        isMobile={isMobile}
        open={!isMobile || isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Layout>
        {isMobile && (
          <MobileHeader
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen((prev) => !prev)}
            sidebarId={SIDEBAR_ID}
          />
        )}
        <Layout.Content className="tw-content">
          <main id="main-content" className="tw-content__main">
            <Outlet />
          </main>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
