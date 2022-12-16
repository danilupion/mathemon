import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './index.module.scss';

interface MenuLinkProps {
  to: string;
  label: string;
  img?: string;
  onClick?: () => void;
}

const MenuLink = ({ to, label, img, onClick }: MenuLinkProps) => {
  const { pathname } = useLocation();

  return (
    <NavLink
      to={to}
      className={classNames(styles.menuLink, { [styles.current]: pathname === to })}
      onClick={onClick}
    >
      {img && <img src={img} alt={label} />} {label}
    </NavLink>
  );
};

export default MenuLink;
