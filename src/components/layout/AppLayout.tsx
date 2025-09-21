import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <Layout className="tw-layout" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Layout.Content style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
