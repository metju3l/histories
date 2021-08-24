import React, { FC, useState } from 'react';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { BiSearchAlt2 } from 'react-icons/bi';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import useDarkMode from '@hooks/useDarkmode';

const Navbar: FC<{
  data: { isLogged: boolean; userID: string };
}> = ({ data }) => {
  // @ts-ignore
  const [theme, setTheme] = useDarkMode();
  const [accountDropdown, setAccountDropdown] = useState('main');
  return (
    <>
      {' '}
      <div className="hidden sm:block w-full text-xm bg-[#212529] text-white cursor-pointer h-14 sticky top-0 z-20">
        <Link href="/" passHref>
          <a className="float-left p-4 hover:bg-[#181818]">Search</a>
        </Link>
        <Link href="/map" passHref>
          <a className="float-left p-4 hover:bg-[#181818]">Map</a>
        </Link>

        <Menu>
          <Menu.Button
            className="float-right py-2 px-4 hover:bg-[#181818]"
            as="a"
          >
            <IoIosArrowDropdownCircle size={32} />
          </Menu.Button>
          <Menu.Items className="shadow-custom absolute bg-white text-blue-500 rounded-xl text-left w-60 px-4 py-2 right-4 top-16 mt-2 display-flex flex-col">
            {accountDropdown === 'main' ? (
              <>
                {data.isLogged && (
                  <div className="py-1.5 hover:text-green-400 cursor-pointer ">
                    <Link href={`/${data.userID}`}> Profile</Link>
                  </div>
                )}
                <div className="py-1.5 hover:text-green-400 cursor-pointer">
                  <Link href="/settings"> Settings</Link>
                </div>
                <div
                  className="py-1.5 hover:text-green-400 cursor-pointer"
                  onClick={() => setAccountDropdown('display')}
                >
                  Display {'>'}
                </div>
                {data.isLogged ? (
                  <div className="py-1.5 hover:text-green-400 cursor-pointer">
                    <Link href="/authorization/logout"> Log out</Link>
                  </div>
                ) : (
                  <div className="py-1.5 hover:text-green-400 cursor-pointer">
                    <Link href="/authorization/login"> Log in</Link>
                  </div>
                )}
              </>
            ) : (
              accountDropdown === 'display' && (
                <>
                  <div
                    className="py-1.5 hover:text-green-400 cursor-pointer text-lg"
                    onClick={() => setAccountDropdown('main')}
                  >
                    {'<'} Display
                  </div>
                  <div className="py-1.5 hover:text-green-400 cursor-pointer">
                    Dark Mode
                  </div>
                  <div
                    className="py-1.5 hover:text-green-400 cursor-pointer"
                    onClick={() => setTheme('dark')}
                  >
                    On
                  </div>
                  <div
                    className="py-1.5 hover:text-green-400 cursor-pointer"
                    onClick={() => setTheme('light')}
                  >
                    Off
                  </div>
                </>
              )
            )}
          </Menu.Items>
        </Menu>
      </div>
      {/* Phone navbar */}
    </>
  );
};

export default Navbar;
