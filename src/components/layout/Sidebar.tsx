// Sidebar displays the primary navigation menu and adapts its presentation
// for mobile or desktop layouts while handling route changes and focus states.
import { FileTextOutlined, StarOutlined, TableOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';
import { BRAND_COPY, NAVIGATION_COPY, ROUTES } from '@/constants';

type SidebarProps = {
  isMobile: boolean;
  open: boolean;
  onClose?: () => void;
};

const menuItems: MenuProps['items'] = [
  { key: ROUTES.HOME, icon: <StarOutlined />, label: NAVIGATION_COPY.HOME },
  { key: ROUTES.ARTICLE, icon: <FileTextOutlined />, label: NAVIGATION_COPY.ARTICLE },
  { key: ROUTES.TABLE, icon: <TableOutlined />, label: NAVIGATION_COPY.TABLE },
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
      <div className="tw-logo">
        <img src={logo} alt={BRAND_COPY.NAME} />
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