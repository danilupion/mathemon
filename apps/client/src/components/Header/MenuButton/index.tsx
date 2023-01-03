import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

import Button from '../../Button';
import NavButton from '../../NavButton';

import styles from './index.module.scss';

interface CommonProps {
  label: string;
  img?: string | JSX.Element;
}

interface LinkProps extends CommonProps {
  to: string;
  onClick?: () => void;
}

interface ButtonProps extends CommonProps {
  onClick: () => void;
}

export type MenuButtonProps = LinkProps | ButtonProps;

const MenuButton = ({ label, img, onClick, ...rest }: MenuButtonProps) => {
  const { pathname } = useLocation();

  const content = (
    <>
      {img && typeof img === 'string' ? <img src={img} alt={label} /> : img} <span>{label}</span>
    </>
  );

  return 'to' in rest ? (
    <NavButton
      to={rest.to}
      className={classNames(styles['menu-button'], { [styles.current]: pathname === rest.to })}
      onClick={onClick}
    >
      {content}
    </NavButton>
  ) : (
    <Button className={styles['menu-button']} onClick={onClick}>
      {content}
    </Button>
  );
};

export default MenuButton;
