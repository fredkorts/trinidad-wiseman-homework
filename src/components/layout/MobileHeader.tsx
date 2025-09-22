import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import logo from '@/assets/images/logo.svg';

type MobileHeaderProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
  return (
    <header className="tw-mobile-header">
      <Button
        aria-label={isOpen ? 'Sulge külgriba' : 'Ava külgriba'}
        aria-expanded={isOpen}
        type="text"
        onClick={onToggle}
        icon={isOpen ? <CloseOutlined /> : <MenuOutlined />}
        className="tw-mobile-header__toggle"
      />
      <div className="tw-mobile-header__logo">
        <img src={logo} alt="Trinidad Wiseman" />
      </div>
    </header>
  );
}
