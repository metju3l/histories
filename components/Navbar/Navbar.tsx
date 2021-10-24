import React, { FC } from 'react';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import useDarkMode from '@lib/hooks/useDarkmode';
import Image from 'next/image';
import LogOut from '@lib/functions/LogOut';
import { Avatar, Input, Switch } from '@nextui-org/react';
import { useIsLoggedQuery } from '@graphql/user.graphql';

// IMAGES
import FullSizeLogo from '@public/logo/FullSizeLogo.svg';
import MinimalLogo from '@public/logo/MinimalLogo.svg';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';

// ICONS
import {
  LocationMarkerIcon,
  HomeIcon,
  LightningBoltIcon,
  LoginIcon,
  XIcon,
  SearchIcon,
} from '@heroicons/react/outline';

const Navbar: FC = () => {
  const { data, loading, error } = useIsLoggedQuery();
  const { theme, setTheme } = useDarkMode();

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  const userIsLogged = data!.isLogged !== null;

  return (
    <nav className="h-[54px] border-b border-[#DADBDA] fixed w-full top-0 bg-white z-40">
      <div className="flex justify-between max-w-6xl w-full items-center mx-5 xl:mx-auto">
        {/* Left */}
        <div className="relative h-[54px] w-24 cursor-pointer">
          <Link href="/" passHref>
            <Image
              src={FullSizeLogo}
              layout="fill"
              objectFit="contain"
              alt="hiStories logo"
            />
          </Link>
        </div>

        {/* Center */}
        <div className="hidden md:flex  bg-[#FAFBFB] border border-[#DADBDA] rounded-md p-1.5">
          <button className="focus:outline-none inline-block text-light-text dark:text-dark-text">
            <SearchIcon className="h-5 w-5 text-[#C6C7C6]" />
          </button>
          <input
            className="w-full outline-none bg-transparent text-lg px-2"
            placeholder="search"
          />
          <button className="focus:outline-none inline-block text-light-text dark:text-dark-text">
            <XIcon className="h-5 w-5 text-[#C6C7C6]" />
          </button>
        </div>

        {/* Right */}
        <div className="flex gap-[20px] items-center">
          <Link href="/" passHref>
            <HomeIcon className="h-8 w-8" />
          </Link>
          <Link href="/explore" passHref>
            <LightningBoltIcon className="h-8 w-8" />
          </Link>
          <Link href="/map" passHref>
            <LocationMarkerIcon className="h-8 w-8" />
          </Link>

          {userIsLogged ? (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button>
                <Avatar
                  size="small"
                  src={GeneratedProfileUrl(
                    data!.isLogged!.firstName,
                    data!.isLogged!.lastName
                  )}
                />
              </Menu.Button>
              <Menu.Items className="absolute z-50 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    <Link href={`/${data!.isLogged!.username}`}>
                      <a className="text-gray-900 group flex rounded-md items-center w-full px-3 py-2 text-sm">
                        Profile
                      </a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link href={`/${data!.isLogged!.username}/collections`}>
                      <a className="text-gray-900 group flex rounded-md items-center w-full px-3 py-2 text-sm">
                        Collections
                      </a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link href={`/settings`}>
                      <a className="text-gray-900 group flex rounded-md items-center w-full px-3 py-2 text-sm">
                        Settings
                      </a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      onClick={LogOut}
                      className="text-gray-900 group flex rounded-b-md items-center w-full px-3 py-2 text-sm border-t border-[#DADBDA]"
                    >
                      Log out
                    </button>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          ) : (
            <Link href="/login" passHref>
              <LoginIcon className="h-8 w-8" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
