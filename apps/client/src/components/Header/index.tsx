import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuthStore } from '../../hooks/useStore';
import Button from '../Button';
import PokemonImage, { PokemonImageType } from '../PokemonImage';

import MenuButton, { MenuButtonProps } from './MenuButton';
import Settings from './Settings';
import SidePanel, { Side } from './SidePanel';
import close from './close.svg';
import gear from './gear.svg';
import styles from './index.module.scss';
import menu from './menu.svg';

const routes: MenuButtonProps[] = [
  {
    to: '/addition',
    label: 'Suma',
    className: styles.addition,
    img: (
      <PokemonImage pokemon={1} type={PokemonImageType.Icon} className={styles['pokemon-image']} />
    ),
  },
  {
    to: '/subtraction',
    label: 'Resta',
    className: styles.subtraction,
    img: (
      <PokemonImage pokemon={7} type={PokemonImageType.Icon} className={styles['pokemon-image']} />
    ),
  },
  {
    to: '/multiplication',
    label: 'Multiplicación',
    className: styles.multiplication,
    img: (
      <PokemonImage pokemon={4} type={PokemonImageType.Icon} className={styles['pokemon-image']} />
    ),
  },
  {
    to: '/division',
    label: 'División',
    className: styles.division,
    img: (
      <PokemonImage pokemon={25} type={PokemonImageType.Icon} className={styles['pokemon-image']} />
    ),
  },
  {
    to: '/multiplicationTables',
    label: 'Tablas',
    img: '/icons/stone-plate.png',
  },
  { to: '/pokedex', label: 'Pokedex', img: '/icons/poke-ball.png' },
];

const pathsWithSettings = ['/addition', '/subtraction', '/multiplication', '/division'];

const Header = () => {
  const authStore = useAuthStore();
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

  const firstEntries: MenuButtonProps[] | MenuButtonProps[][] = authStore.signedIn
    ? [
        [
          { label: 'Cuenta', to: '/account', className: styles.account },
          { label: 'Salir', onClick: authStore.signOut },
        ],
      ]
    : [{ to: '/signIn', label: 'Iniciar Sesión', img: '/icons/basement-key.png' }];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button onClick={toggleLeftPanel} className={styles['side-panel-toggle']}>
          <img src={leftPanelOpen ? close : menu} alt="Open Menu" />
        </Button>
        <h1>
          <a href="/">
            <img src="/icons/poke-ball.png" alt="Mathemon" />
            <span>Mathemon</span>
          </a>
        </h1>
        <Button
          disabled={!pathHasSettings}
          onClick={toggleRightPanel}
          className={styles['side-panel-toggle']}
        >
          <img src={rightPanelOpen ? close : gear} alt="Open Settings" />
        </Button>
      </div>
      <SidePanel open={leftPanelOpen} onClose={closeLeftPanel} side={Side.Left}>
        {[...firstEntries, ...routes].map((item, index) => {
          return Array.isArray(item) ? (
            <div className={styles.row} key={index}>
              {item.map(({ onClick, ...props }, subIndex) => (
                <MenuButton
                  key={subIndex}
                  {...props}
                  {...props}
                  onClick={() => {
                    onClick?.();
                    closeLeftPanel();
                  }}
                />
              ))}
            </div>
          ) : (
            <MenuButton
              key={index}
              {...item}
              onClick={() => {
                item.onClick?.();
                closeLeftPanel();
              }}
            />
          );
        })}
      </SidePanel>
      <SidePanel open={rightPanelOpen} onClose={closeRightPanel} side={Side.Right}>
        {pathHasSettings && <Settings onSave={closeRightPanel} />}
      </SidePanel>
    </div>
  );
};

export default Header;
