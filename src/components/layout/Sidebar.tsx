import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, ReadOutlined, TableOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  const items = [
    { key: '/', icon: <HomeOutlined />, label: 'Home' },
    { key: '/article', icon: <ReadOutlined />, label: 'Article' },
    { key: '/table', icon: <TableOutlined />, label: 'Table' }
  ];

  return (
    <Sider collapsible collapsed={collapsed} width={200} breakpoint="lg" collapsedWidth={64} role="navigation" aria-label="Main">
      <div className="p-2" style={{ padding: 12 }}>
        <Button
          aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
          type="text"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          style={{ color: '#fff' }}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[loc.pathname]}
        items={items}
        onClick={({ key }) => nav(String(key))}
      />
    </Sider>
  );
}
