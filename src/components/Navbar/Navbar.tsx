import React, { FC, useState } from 'react';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { IoLogoWordpress } from 'react-icons/io';
import { BiSearchAlt2 } from 'react-icons/bi';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import useDarkMode from '@hooks/useDarkmode';

const Navbar: FC = () => {
  // @ts-ignore
  const [theme, setTheme] = useDarkMode();
  const [page, setPage] = useState('feed');
  const { data, loading, error } = useIsLoggedQuery();
  const [accountDropdown, setAccountDropdown] = useState('main');
  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  const isLogged = data?.isLogged.isLogged;

  return (
    <nav>
      <ul className="bg-opacity-50 backdrop-filter backdrop-blur-md dark:text-white dark:bg-black bg-white text-black w-full fixed top-0 z-20">
        <Link href="/">
          <li className="active py-1.5 px-4 ml-8 float-left">
            <a className="text-center display-block">
              <IoLogoWordpress size={42} />{' '}
              {/* hope that oonce here will be some normal logo xdd :(*/}
            </a>
          </li>
        </Link>
        <li className="active py-4 px-4 float-left">
          <div className="w-full flex bg-white text-black p-2 rounded-full ">
            <button type="submit" className="focus:outline-none inline-block ">
              <BiSearchAlt2 size={24} />
            </button>
            <input
              className="w-11/12 rounded-sm outline-none border-none inline-block text-light-text"
              placeholder="Search..."
            />
          </div>
        </li>
        {isLogged && (
          <li className="active py-1.5 px-4 ml-8 float-right text-center pt-4 flex">
            <div className="flex text-center bg-gray-400 p-1 rounded-3xl">
              <div className="rounded-full h-8 w-8 bg-red-500 mr-1"></div>
              logged
            </div>
            <Menu>
              <Menu.Button>
                <IoIosArrowDropdownCircle size={32} />
              </Menu.Button>
              <Menu.Items className="shadow-custom absolute bg-white text-blue-500 rounded-xl text-left w-60 px-4 py-2 right-4 top-16 mt-2 display-flex flex-col">
                {accountDropdown === 'main' ? (
                  <>
                    <div className="py-1.5 hover:text-green-400 cursor-pointer ">
                      Profile
                    </div>
                    <div className="py-1.5 hover:text-green-400 cursor-pointer">
                      Settings
                    </div>
                    <div
                      className="py-1.5 hover:text-green-400 cursor-pointer"
                      onClick={() => setAccountDropdown('display')}
                    >
                      Display {'>'}
                    </div>
                    <div className="py-1.5 hover:text-green-400 cursor-pointer">
                      Log out
                    </div>
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
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
