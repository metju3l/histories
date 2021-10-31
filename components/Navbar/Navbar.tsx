import React, { useState } from 'react';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import useDarkMode from '@lib/hooks/useDarkmode';
import Image from 'next/image';
import LogOut from '@lib/functions/LogOut';
import { Avatar, Input, Switch } from '@nextui-org/react';
import { useIsLoggedQuery } from '@graphql/user.graphql';

import styles from './Navbar.module.scss';
import transition from './transitions/primary.module.scss';
import transitionSecondary from './transitions/secondary.module.scss';
import { CSSTransition } from 'react-transition-group';

// IMAGES
import FullSizeLogo from '@public/logo/FullSizeLogo.svg';
import MinimalLogo from '@public/logo/MinimalLogo.svg';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';

const Navbar: React.FC = () => {
  const { data, loading, error } = useIsLoggedQuery();
  const { theme, setTheme } = useDarkMode();

  if (loading) return <div>navbar loading</div>;
  if (error) return <div>navbar error</div>;

  return (
    <nav className={styles.navbarNav}>
      <div className={styles.navbar}>
        <div className={styles.navBlock}>hiStories</div>
        <div className={styles.navBlock}>
          <NavbarItem
            link="createPost"
            icon={
              <svg aria-hidden="true" viewBox="0 0 448 512">
                <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
              </svg>
            }
          />

          <Link href={'link'} passHref>
            <a className={styles.iconButton}>
              <svg viewBox="0 0 28 28">
                <path d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"></path>
              </svg>
            </a>
          </Link>
          <NavbarItem
            icon={
              <svg viewBox="0 0 320 512">
                <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
              </svg>
            }
          >
            <DropdownMenu data={data} setTheme={setTheme} />
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
  );
};

export default Navbar;

const DropdownItem: React.FC<{
  link: string;
  leftIcon: any;
  rightIcon?: any;
  onClick?: any;
}> = ({ link, children, leftIcon, onClick, rightIcon }) => {
  return (
    <Link href={link} passHref>
      <a className={styles.menuItem} onClick={onClick}>
        <span className={styles.iconButton}>{leftIcon}</span>
        {children}
        {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
      </a>
    </Link>
  );
};

const DropdownMenu: React.FC<{ data: any; setTheme: any }> = ({
  data,
  setTheme,
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
                <Avatar
                  size="small"
                  src={GeneratedProfileUrl(
                    data.isLogged.firstName,
                    data.isLogged.lastName
                  )}
                />
              }
            >
              {`${data.isLogged.firstName} ${data.isLogged.lastName}`}
            </DropdownItem>
          )}
          <DropdownItem
            link="#"
            leftIcon={
              <svg viewBox="0 0 512 512">
                <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
              </svg>
            }
          >
            Settings & Privacy
          </DropdownItem>{' '}
          <DropdownItem
            link="#"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            }
            rightIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            }
            onClick={() => setActiveMenu('settings')}
          >
            Display & Accessibility
          </DropdownItem>{' '}
          {userIsLogged ? (
            <DropdownItem
              link="logout"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              Log out
            </DropdownItem>
          ) : (
            <DropdownItem
              link="login"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
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
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
            }
            onClick={() => setActiveMenu('main')}
          >
            <h2 className="text-lg"> Display & Accessibility</h2>
          </DropdownItem>

          <a className={styles.menuItem}>
            <span className={styles.iconButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </span>
            Dark mode
          </a>
          <button onClick={() => setTheme('dark')}>on</button>
          <button onClick={() => setTheme('light')}>off</button>
        </div>
      </CSSTransition>
    </div>
  );
};
