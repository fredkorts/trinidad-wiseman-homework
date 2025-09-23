// MobileHeader renders the top navigation bar for small screens, providing
// a toggle button for the sidebar and displaying the app logo.
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import logo from '@/assets/images/logo.svg';
import { BRAND_COPY, MOBILE_HEADER_COPY } from '@/constants';

type MobileHeaderProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
  return (
    <header className="tw-mobile-header">
      <Button
        aria-label={isOpen ? MOBILE_HEADER_COPY.CLOSE_SIDEBAR : MOBILE_HEADER_COPY.OPEN_SIDEBAR}
        aria-expanded={isOpen}
        type="text"
        onClick={onToggle}
        icon={isOpen ? <CloseOutlined /> : <MenuOutlined />}
        className="tw-mobile-header__toggle"
      />
      <div className="tw-mobile-header__logo">
        <img src={logo} alt={BRAND_COPY.NAME} />
      </div>
    </header>
  );
}
