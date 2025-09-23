import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/constants';

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
        isMobile={isMobile}
        open={!isMobile || isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Layout>
        {isMobile && (
          <MobileHeader
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen((prev) => !prev)}
          />
        )}
        <Layout.Content className="tw-content">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
