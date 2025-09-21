import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  TableOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Menu, Grid } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';

const { useBreakpoint } = Grid;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.lg; // < lg => mobile/tablet
  const nav = useNavigate();
  const loc = useLocation();

  const items = [
    { key: '/', icon: <QuestionCircleOutlined />, label: 'Nõuded' },
    { key: '/article', icon: <FileTextOutlined />, label: 'Artikkel' },
    { key: '/table', icon: <TableOutlined />, label: 'Tabel' },
  ];

  return (
    <Sider
      className="tw-sider"
      theme="light"
      /* Desktop: never collapsed; Mobile: controlled collapse */
      collapsed={isMobile ? collapsed : false}
      collapsedWidth={isMobile ? 0 : 220}
      width={220}
      /* No built-in trigger; we render a button only on mobile */
      trigger={null}
      /* Auto-collapse when crossing breakpoint */
      breakpoint="lg"
      onBreakpoint={(broken) => setCollapsed(broken)}
    >
      <div className="tw-logo" style={{ gap: 8 }}>
        <img src={logo} alt="Trinidad Wiseman" style={{ height: 28, width: 'auto' }} />
        {/* Show toggle button ONLY on mobile */}
        {isMobile && (
          <Button
            aria-label={collapsed ? 'Ava külgriba' : 'Sulge külgriba'}
            type="text"
            onClick={() => setCollapsed((v) => !v)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{ marginLeft: 'auto' }}
          />
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[loc.pathname]}
        items={items}
        onClick={({ key }) => {
          nav(String(key));
          if (isMobile) setCollapsed(true); // close after navigating on mobile
        }}
      />
    </Sider>
  );
}
