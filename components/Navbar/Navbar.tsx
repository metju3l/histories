import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import GeneratedProfileUrl from '../../lib/functions/GeneratedProfileUrl';
import LogOut from '../../lib/functions/LogOut';
import BackIcon from '../Icons/BackIcon';
import BellIcon from '../Icons/BellIcon';
import ExploreIcon from '../Icons/ExploreIcon';
import HomeIcon from '../Icons/HomeIcon';
import LoginIcon from '../Icons/LoginIcon';
import LogOutIcon from '../Icons/LogOutIcon';
import MapIcon from '../Icons/MapIcon';
import MenuIcon from '../Icons/MenuIcon';
import MoonIcon from '../Icons/MoonIcon';
import NextIcon from '../Icons/NextIcon';
import SettingsIcon from '../Icons/SettingsIcon';
import { LoginContext } from '../Layout';

const Navbar: React.FC = () => {
  const loginContext = React.useContext(LoginContext);
  const { theme, setTheme } = useTheme();

  if (loginContext.loading) return <div>navbar loading</div>;
  if (loginContext.error) return <div>navbar error</div>;
  const userIsLogged = loginContext.data!.isLogged !== null;

  return (
    <nav className="fixed items-center justify-between px-12 bottom-0 flex w-full bg-dark-background-primary border-t border-gray-200 md:top-0 z-30 text-white">
      <Link href="/" passHref>
        <a className="space-y-[0.3rem] text-[0.9rem] py-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto w-[1.3rem] h-[1.3rem]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>

          <div className="align-middle">Home</div>
        </a>
      </Link>
      <Link href="/explore" passHref>
        <a className="space-y-[0.3rem] text-[0.9rem] py-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto w-[1.3rem] h-[1.3rem]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clipRule="evenodd"
            />
          </svg>
          <div className="align-middle">Explore</div>
        </a>
      </Link>
      <Link href="/map" passHref>
        <a className="space-y-[0.3rem] text-[0.9rem] py-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto w-[1.3rem] h-[1.3rem]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <div className="align-middle">Map</div>
        </a>
      </Link>
      <Link href="/map" passHref>
        <a className="space-y-[0.3rem] text-[0.9rem] py-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="user-circle"
            className="mx-auto w-[1.3rem] h-[1.3rem]"
            role="img"
            viewBox="0 0 496 512"
          >
            <path
              fill="currentColor"
              d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"
            />
          </svg>

          <div className="align-middle">Map</div>
        </a>
      </Link>
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
            <a>{icon}</a>
          </Link>
        ) : (
          <a onClick={() => setOpen(!open)}>{icon}</a>
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
      <a onClick={onClick}>
        {leftIcon && <span>{leftIcon}</span>} {children}
        {rightIcon && <span>{rightIcon}</span>}
      </a>
    </Link>
  ) : (
    <a onClick={onClick}>
      {leftIcon && <span>{leftIcon}</span>} {children}
      {rightIcon && <span>{rightIcon}</span>}
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
    <div style={{}}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        onEnter={calculateHeight}
        unmountOnExit
      >
        <div>
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
          </DropdownItem>{' '}
          <DropdownItem leftIcon={<SettingsIcon />}>
            <div onClick={() => setTheme('light')}>light mode</div>
          </DropdownItem>{' '}
          <DropdownItem leftIcon={<SettingsIcon />}>
            <div onClick={() => setTheme('dark')}>dark mode</div>
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
        onEnter={calculateHeight}
        unmountOnExit
      >
        <div>
          <DropdownItem
            leftIcon={<BackIcon />}
            onClick={() => setActiveMenu('main')}
          >
            <h2 className="text-lg"> Display & Accessibility</h2>
          </DropdownItem>
          <a>
            <span>
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
