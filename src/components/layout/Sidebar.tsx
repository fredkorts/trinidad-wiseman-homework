import { FileTextOutlined, QuestionCircleOutlined, TableOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';

type SidebarProps = {
  isMobile: boolean;
  open: boolean;
  onClose?: () => void;
};

const menuItems: MenuProps['items'] = [
  { key: '/', icon: <QuestionCircleOutlined />, label: 'Avaleht' },
  { key: '/article', icon: <FileTextOutlined />, label: 'Artikkel' },
  { key: '/table', icon: <TableOutlined />, label: 'Tabel' },
];

export function Sidebar({ isMobile, open, onClose }: SidebarProps) {
  const nav = useNavigate();
  const loc = useLocation();

  const classNames = ['tw-sider'];

  if (isMobile) {
    classNames.push('tw-sider--mobile');

    if (open) {
      classNames.push('tw-sider--open');
    }
  }

  return (
    <Sider
      className={classNames.join(' ')}
      theme="light"
      width={220}
      trigger={null}
      aria-hidden={isMobile && !open}
    >
      <div className="tw-logo" style={{ gap: 8 }}>
        <img src={logo} alt="Trinidad Wiseman" />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[loc.pathname]}
        items={menuItems}
        onClick={({ key }) => {
          nav(String(key));
          if (isMobile && onClose) {
            onClose();
          }
        }}
      />
    </Sider>
  );
}