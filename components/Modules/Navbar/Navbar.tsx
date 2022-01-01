import { Menu } from '@headlessui/react';
import FirstLetterUppercase from '@lib/functions/FirstLetterUppercase';
import LogOut from '@lib/functions/LogOut';
import UrlPrefix from '@lib/functions/UrlPrefix';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { LoginContext } from '../../Layouts';
import DropdownItem from './DropdownItem';
import NavbarItem from './NavbarItem';

const Navbar: React.FC = () => {
  const router = useRouter();
  const loginContext = React.useContext(LoginContext);
  const { t } = useTranslation();
  const userIsLogged = loginContext.data?.me?.id;

  if (loginContext.error) console.error(loginContext.error);

  return (
    <nav className="fixed z-40 w-full bg-white border-b border-gray-200 dark:text-white dark:bg-[#171716] dark:border-gray-800">
      <div className="flex items-center justify-between h-full max-w-4xl pt-4 m-auto">
        {/* LEFT SIDE */}
        <span className="flex">
          <NavbarItem text="Home" href="/" active={router.pathname === '/'} />
          <NavbarItem
            text={t('explore')}
            href="/explore"
            active={router.pathname === '/explore'}
          />
          <NavbarItem
            text={t('map')}
            href="/map"
            active={router.pathname === '/map'}
          />
        </span>

        {/* RIGHT SIDE */}
        <span className="flex items-center gap-2">
          <Link href="/about">
            <a className="px-2 py-1 mr-2 font-medium text-gray-600 rounded-lg cursor-pointer dark:text-gray-200 transition ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800">
              {FirstLetterUppercase(t('about'))}
            </a>
          </Link>
          {userIsLogged ? (
            <Menu as="div" className="relative">
              <Menu.Button
                as="div"
                className="relative w-8 h-8 border-2 border-transparent rounded-full cursor-pointer transition ease-in-out hover:border-gray-200"
              >
                <Image
                  className="rounded-full gray-400"
                  src={
                    // if user has a profile picture add IPFS gateway to hash
                    loginContext.data!.me!.profile.startsWith('http')
                      ? loginContext.data!.me!.profile
                      : UrlPrefix + loginContext.data!.me!.profile
                  }
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  alt="Profile picture"
                />
              </Menu.Button>
              <Menu.Items
                as="div"
                className="absolute right-0 z-50 flex flex-col w-48 mt-2 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 focus:outline-none dark:border-gray-800 truncated"
              >
                <DropdownItem
                  text={loginContext.data!.me!.username}
                  href={`/${loginContext.data!.me!.username}`}
                  top
                />
                <DropdownItem text={t('create post')} href="/createPost" />
                <DropdownItem text={t('settings')} href="/settings" />
                <DropdownItem
                  text={t('logout')}
                  onClick={() => LogOut()}
                  bottom
                />
              </Menu.Items>
            </Menu>
          ) : (
            <>
              <Link href="/login">
                <a className="px-4 py-1 font-medium text-gray-600 border border-gray-600 cursor-pointer rounded-md dark:text-gray-200 transition ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800">
                  {t('login')}
                </a>
              </Link>
              <Link href="/register">
                <a className="block px-4 py-1 font-medium bg-gray-800 border border-gray-800 rounded-md text-gray-50">
                  {t('register')}
                </a>
              </Link>
            </>
          )}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
