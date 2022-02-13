import { Menu, Transition } from '@headlessui/react';
import FirstLetterUppercase from '@lib/functions/FirstLetterUppercase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { LoginContext } from '../../layouts';
import DropdownTransition from '../Dropdown/DropdownTransition';
import { NavbarItem, UserDropdown } from './index';

const Navbar: React.FC = () => {
  const router = useRouter();
  const loginContext = React.useContext(LoginContext);
  const { t } = useTranslation();
  const userIsLogged = loginContext.data?.me?.id;

  if (loginContext.error) console.error(loginContext.error);

  return (
    <nav className="fixed z-40 w-full bg-white border-b border-gray-200 dark:text-white dark:bg-[#171716] dark:border-gray-800">
      <div className="flex items-center justify-between h-full max-w-6xl px-4 py-2 m-auto">
        {/* LEFT SIDE */}
        <span className="flex items-center h-full gap-2">
          <NavbarItem
            text="Home"
            href="/home"
            active={router.pathname === '/home'}
          />
          <NavbarItem
            text={t('map')}
            href="/"
            active={router.pathname === '/'}
          />
        </span>

        {/* RIGHT SIDE */}
        <span className="flex items-center gap-2 pr-č">
          <span className="hidden md:block">
            <Link href="/about">
              <a className="px-2 py-1 mr-2 font-medium text-gray-600 rounded-lg cursor-pointer dark:text-gray-200 transition ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800">
                {FirstLetterUppercase(t('about'))}
              </a>
            </Link>
          </span>
          {userIsLogged ? (
            <UserDropdown />
          ) : (
            <>
              <span className="hidden md:block">
                <Link href="/login">
                  <a className="px-4 py-1 font-medium text-gray-600 border border-gray-600 cursor-pointer rounded-md dark:text-gray-200 transition ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800">
                    {t('login')}
                  </a>
                </Link>
              </span>
              <span className="hidden md:block">
                <Link href="/register">
                  <a className="block px-4 py-1 font-medium bg-gray-800 border border-gray-800 rounded-md text-gray-50">
                    {t('register')}
                  </a>
                </Link>
              </span>
              <span className="block md:hidden">
                <Menu as="div" className="relative">
                  <Menu.Button
                    as="div"
                    className="relative w-8 h-8 bg-gray-400 border-2 border-transparent rounded-full cursor-pointer transition ease-in-out"
                  ></Menu.Button>
                  <Transition as={Fragment} {...DropdownTransition}>
                    <Menu.Items
                      as="div"
                      className="absolute right-0 z-50 flex flex-col w-48 mt-2 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 focus:outline-none dark:border-gray-800 truncated"
                    >
                      <Link href="/login" passHref>
                        <Menu.Item
                          as="div"
                          className="rounded-t-lg dropdown-item"
                        >
                          {t('login')}
                        </Menu.Item>
                      </Link>

                      <Link href="/register" passHref>
                        <Menu.Item as="div" className="dropdown-item">
                          {t('register')}
                        </Menu.Item>
                      </Link>

                      {/* CLOSE */}
                      <Menu.Item
                        as="div"
                        className="rounded-b-lg dropdown-item"
                      >
                        {t('close')}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </span>
            </>
          )}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
