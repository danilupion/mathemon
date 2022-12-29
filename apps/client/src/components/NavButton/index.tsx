import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import styles from './index.module.scss';

type NavButtonProps = Omit<NavLinkProps, 'children' | 'className'> &
  PropsWithChildren<{ className?: string }>;

const NavButton = ({ children, className, ...props }: NavButtonProps) => {
  return (
    <NavLink className={classNames(styles['nav-button'], className)} {...props}>
      {children}
    </NavLink>
  );
};

export default NavButton;
