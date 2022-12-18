import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

import MenuLink from './MenuLink';
import Settings from './Settings';
import SidePanel, { Side } from './SidePanel';
import bulbasaur from './bulbasaur.png';
import charmander from './charmander.png';
import close from './close.svg';
import gear from './gear.svg';
import icon from './icon.png';
import styles from './index.module.scss';
import menu from './menu.svg';
import pikachu from './pikachu.png';
import squirtle from './squirtle.png';

interface HeaderRoute {
  to: string;
  label: string;
  img?: string;
}

const routes: HeaderRoute[] = [
  { to: '/addition', label: 'Suma', img: bulbasaur },
  { to: '/subtraction', label: 'Resta', img: squirtle },
  { to: '/multiplicationTables', label: 'Tablas', img: charmander },
  { to: '/multiplication', label: 'Multiplicación', img: pikachu },
  { to: '/pokedex', label: 'Pokedex' },
];

const pathsWithSettings = ['/addition', '/subtraction', '/multiplication'];

const Header = () => {
  const { pathname } = useLocation();

  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const closeLeftPanel = useCallback(() => {
    setLeftPanelOpen(false);
  }, [setLeftPanelOpen]);

  const closeRightPanel = useCallback(() => {
    setRightPanelOpen(false);
  }, [setRightPanelOpen]);

  const toggleLeftPanel = useCallback(() => {
    if (!leftPanelOpen) {
      closeRightPanel();
    }
    setLeftPanelOpen(!leftPanelOpen);
  }, [leftPanelOpen, setLeftPanelOpen, closeRightPanel]);

  const toggleRightPanel = useCallback(() => {
    if (!rightPanelOpen) {
      closeLeftPanel();
    }
    setRightPanelOpen(!rightPanelOpen);
  }, [rightPanelOpen, setRightPanelOpen, closeLeftPanel]);

  const pathHasSettings = pathsWithSettings.includes(pathname);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={toggleLeftPanel}>
          <img src={leftPanelOpen ? close : menu} alt="Open Menu" />
        </button>
        <h1>
          <a href="/">
            <img src={icon} alt="Icon" />
            <span> Mathemon</span>
          </a>
        </h1>
        <button
          className={classNames({
            [styles.disabled]: !pathHasSettings,
          })}
          disabled={!pathHasSettings}
          onClick={toggleRightPanel}
        >
          <img src={rightPanelOpen ? close : gear} alt="Open Settings" />
        </button>
      </div>
      <SidePanel open={leftPanelOpen} onClose={closeLeftPanel} side={Side.Left}>
        {routes.map(({ to, label, img }) => (
          <MenuLink key={to} to={to} label={label} img={img} onClick={closeLeftPanel} />
        ))}
      </SidePanel>
      <SidePanel open={rightPanelOpen} onClose={closeRightPanel} side={Side.Right}>
        {pathHasSettings && <Settings onSave={closeRightPanel} />}
      </SidePanel>
    </div>
  );
};

export default Header;
