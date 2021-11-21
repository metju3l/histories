import BackIcon from '@components/Icons/BackIcon';
import BellIcon from '@components/Icons/BellIcon';
import ExploreIcon from '@components/Icons/ExploreIcon';
import HomeIcon from '@components/Icons/HomeIcon';
import LoginIcon from '@components/Icons/LoginIcon';
import LogOutIcon from '@components/Icons/LogOutIcon';
import MapIcon from '@components/Icons/MapIcon';
import MenuIcon from '@components/Icons/MenuIcon';
import MoonIcon from '@components/Icons/MoonIcon';
import NextIcon from '@components/Icons/NextIcon';
import PlusIcon from '@components/Icons/PlusIcon';
import SettingsIcon from '@components/Icons/SettingsIcon';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import LogOut from '@lib/functions/LogOut';
import useDarkMode from '@lib/hooks/useDarkmode';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './Navbar.module.scss';
import transition from './transitions/primary.module.scss';
import transitionSecondary from './transitions/secondary.module.scss';

const Navbar: React.FC = () => {
  const { data, loading, error } = useIsLoggedQuery();
  const { theme, setTheme } = useDarkMode();

  if (loading) return <div>navbar loading</div>;
  if (error) return <div>navbar error</div>;

  const userIsLogged = data!.isLogged !== null;

  return (
    <nav className={styles.navbarNav}>
      <div className={styles.navbar}>
        <div className={styles.navBlock}>
          <Link href="/">hiStories</Link>
        </div>{' '}
        <div className={styles.navBlock}>
          <Link href={'/'} passHref>
            <a className={styles.iconButton}>
              <HomeIcon />
            </a>
          </Link>
          <Link href={'explore'} passHref>
            <a className={styles.iconButton}>
              <ExploreIcon />
            </a>
          </Link>
          <Link href={'map'} passHref>
            <a className={styles.iconButton}>
              <MapIcon />
            </a>
          </Link>
        </div>
        <div className={styles.navBlock}>
          {userIsLogged && (
            <Link href={'createPost'} passHref>
              <a className={styles.iconButton}>
                <PlusIcon />
              </a>
            </Link>
          )}
          <Link href={'/'} passHref>
            <a className={styles.iconButton}>
              <BellIcon />
            </a>
          </Link>
          <NavbarItem icon={<MenuIcon />}>
            <DropdownMenu data={data} setTheme={setTheme} theme={theme} />
          </NavbarItem>
        </div>
      </div>
    </nav>
  );
};
const NavbarItem: React.FC<{ link?: string; icon: any }> = ({
  link,
  icon,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <section
          id="overlay"
          className={`absolute top-[60px] left-0 w-full h-full z-[40]`}
          onClick={() => setOpen(false)}
        />
      )}
      <div>
        {link ? (
          <Link href={link} passHref>
            <a className={styles.iconButton}>{icon}</a>
          </Link>
        ) : (
          <a className={styles.iconButton} onClick={() => setOpen(!open)}>
            {icon}
          </a>
        )}
        {open && children}
      </div>
    </>
  );
};

export default Navbar;

const DropdownItem: React.FC<{
  link?: string;
  leftIcon?: any;
  rightIcon?: any;
  onClick?: any;
}> = ({ link, children, leftIcon, onClick, rightIcon }) => {
  return link ? (
    <Link href={link} passHref>
      <a className={styles.menuItem} onClick={onClick}>
        {leftIcon && <span className={styles.iconButton}>{leftIcon}</span>}{' '}
        {children}
        {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
      </a>
    </Link>
  ) : (
    <a className={styles.menuItem} onClick={onClick}>
      {leftIcon && <span className={styles.iconButton}>{leftIcon}</span>}{' '}
      {children}
      {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
    </a>
  );
};

const DropdownMenu: React.FC<{ data: any; setTheme: any; theme: string }> = ({
  data,
  setTheme,
  theme,
}) => {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(0);

  const userIsLogged = data!.isLogged !== null;

  const calculateHeight = (element: any) => {
    const height = element.offsetHeight;
    console.log(menuHeight);
    setMenuHeight(height);
  };

  return (
    <div className={styles.dropdown} style={{}}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames={{ ...transition }}
        onEnter={calculateHeight}
        unmountOnExit
      >
        <div className={styles.menu}>
          {userIsLogged && (
            <DropdownItem
              link={`/${data.isLogged.username}`}
              leftIcon={
                <Image
                  height={120}
                  width={120}
                  src={GeneratedProfileUrl(
                    data.isLogged.firstName,
                    data.isLogged.lastName
                  )}
                  alt="profile picture"
                  className="rounded-full"
                />
              }
            >
              {`${data.isLogged.firstName} ${data.isLogged.lastName}`}
            </DropdownItem>
          )}
          <DropdownItem link="#" leftIcon={<SettingsIcon />}>
            Settings & Privacy
          </DropdownItem>
          <DropdownItem
            link="#"
            leftIcon={<MoonIcon />}
            rightIcon={<NextIcon />}
            onClick={() => setActiveMenu('settings')}
          >
            Display & Accessibility
          </DropdownItem>{' '}
          {userIsLogged ? (
            <DropdownItem onClick={() => LogOut()} leftIcon={<LogOutIcon />}>
              Log out
            </DropdownItem>
          ) : (
            <DropdownItem link="/login" leftIcon={<LoginIcon />}>
              Log in
            </DropdownItem>
          )}
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === 'settings'}
        timeout={500}
        classNames={{ ...transitionSecondary }}
        onEnter={calculateHeight}
        unmountOnExit
      >
        <div className={styles.menu}>
          <DropdownItem
            link="#"
            leftIcon={<BackIcon />}
            onClick={() => setActiveMenu('main')}
          >
            <h2 className="text-lg"> Display & Accessibility</h2>
          </DropdownItem>
          <a className={styles.menuItem}>
            <span className={styles.iconButton}>
              <MoonIcon />
            </span>
            Dark mode
          </a>
          <DropdownItem onClick={() => setTheme('dark')}>
            <div className="flex items-center justify-between w-full ml-8 cursor-pointer">
              On
              <input type="radio" checked={theme === 'dark'} />
            </div>
          </DropdownItem>{' '}
          <DropdownItem onClick={() => setTheme('light')}>
            <div className="flex items-center justify-between w-full ml-8 cursor-pointer">
              Off
              <input type="radio" checked={theme === 'light'} />
            </div>
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
};
