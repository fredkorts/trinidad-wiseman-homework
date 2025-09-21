import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Layout.Content style={{ padding: '16px' }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
