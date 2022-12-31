import classNames from 'classnames';
import { CSSProperties, PropsWithChildren } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import styles from './index.module.scss';

type NavButtonNavLinkProps = Omit<NavLinkProps, 'children' | 'className' | 'style'> &
  PropsWithChildren<{ native?: boolean; className?: string; style?: CSSProperties }>;

type NavButtonAnchorProps = Omit<NavButtonNavLinkProps, 'to'> & { href: string };

type NavButtonProps<Native extends boolean> = Native extends true
  ? NavButtonAnchorProps
  : NavButtonNavLinkProps;

const NavButton = <Native extends boolean>({
  children,
  className,
  native = false,
  ...props
}: NavButtonProps<Native>) => {
  const Component = native ? 'a' : NavLink;

  return (
    <Component
      className={classNames(styles['nav-button'], className)}
      {...(props as unknown as NavButtonNavLinkProps)}
    >
      {children}
    </Component>
  );
};

export default NavButton;
