import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import React from 'react';

import { Button } from '../Button';
import { LoginContext } from '../Layout';

const Navbar: React.FC = () => {
  const router = useRouter();

  const loginContext = React.useContext(LoginContext);
  const { theme, setTheme } = useTheme();

  const userIsLogged = loginContext.data?.isLogged !== null;

  if (loginContext.error) console.error(loginContext.error);
  return (
    <nav className="fixed bottom-0 z-30 flex items-center justify-between w-full px-6 text-white border-t border-gray-400 md:h-14 md:border-0 md:bottom-auto md:top-0 bg-dark-background-primary">
      <span className="flex justify-between w-full md:justify-start md:gap-10">
        <NavbarItem
          link="/"
          text="Home"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto w-[1.3rem] h-[1.3rem]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          }
        />
        <NavbarItem
          link="/explore"
          text="Explore"
          icon={
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
          }
        />
        <NavbarItem
          link="/map"
          text="Map"
          icon={
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
          }
        />

        <NavbarItem
          hideOnMd // show only on mobile
          link={
            loginContext.data?.isLogged // when user is logged in
              ? `/${loginContext.data.isLogged.username}` // profile page
              : '/login' // login page
          }
          text="Profile"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="user-circle"
              className="mx-auto w-[1.3rem] h-[1.3rem]" // align at center
              role="img"
              viewBox="0 0 496 512"
            >
              <path
                fill="currentColor"
                d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"
              />
            </svg>
          }
        />
      </span>
      {
        // don't show this section when logged query is loading or when error occurs
        !loginContext.loading && loginContext.error === undefined && (
          <span className="hidden md:block">
            {loginContext.data?.isLogged ? (
              // if user is logged in show his profile
              <Link href={'/' + loginContext.data.isLogged?.username} passHref>
                <div className="relative w-8 h-8 cursor-pointer">
                  <Image
                    src={loginContext.data.isLogged.profile}
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                    className="rounded-full bg-secondary"
                    alt="Profile picture"
                  />
                </div>
              </Link>
            ) : (
              // if user is not logged show sign in and login buttons
              <span className="flex md:gap-2 md:py-1">
                <span className="w-28">
                  <Button type="secondary">Sign in</Button>
                </span>
                <span className="w-28">
                  <Button type="primary">Register</Button>
                </span>
              </span>
            )}
          </span>
        )
      }
    </nav>
  );
};

type NavbarItemProps = {
  link: string;
  icon: JSX.Element; // icon as a SVG
  text: string;
  hideOnMd?: boolean;
  hideOnSm?: boolean;
};

const NavbarItem: React.FC<NavbarItemProps> = ({
  link,
  icon,
  text,
  hideOnMd,
  hideOnSm,
}) => {
  return (
    <Link href={link} passHref>
      <a
        className={`space-y-[0.3rem] text-[0.9rem] py-1.5 ${
          hideOnMd ? 'md:hidden' : ''
        }
        ${hideOnSm ? 'hidden md:block' : ''}
        `}
      >
        <span className="block md:hidden" /* visible only on mobile */>
          {icon}
        </span>
        <div>{text}</div>
      </a>
    </Link>
  );
};

export default Navbar;
