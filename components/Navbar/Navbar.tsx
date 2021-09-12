import React, { FC, useState } from 'react';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import useDarkMode from '@hooks/useDarkmode';
import Image from 'next/image';
import LogOut from '@lib/functions/LogOut';

// ICONS
import { IoIosArrowDropdownCircle, IoMdSettings } from 'react-icons/io';
import { MdNotificationsActive, MdPeople } from 'react-icons/md';
import { FaMapMarkedAlt, FaUserCircle } from 'react-icons/fa';
import { BiSearchAlt2 } from 'react-icons/bi';
import { RiLoginBoxFill, RiLogoutBoxFill } from 'react-icons/ri';

const Navbar: FC<{ data: any }> = ({ data }) => {
  const { setTheme } = useDarkMode();
  const [accountDropdown, setAccountDropdown] = useState('main');

  return (
    <div className="w-full text-xm bg-[#343233] text-white h-14 sticky top-0 z-20">
      <div className="max-w-screen-xl m-auto">
        <Link href="/" passHref>
          <a className="float-left p-4 hover:bg-[#181818]">hiStories</a>
        </Link>

        <div className="hidden sm:flex float-left bg-white rounded-full text-black p-1 px-2 mt-3">
          <BiSearchAlt2 size={24} />
          <input
            type="text"
            className="w-full rounded-sm outline-none border-none inline-block text-light-text"
          />
          <button> x</button>
        </div>

        <Menu>
          <Menu.Button
            className="float-right py-2 px-4 hover:bg-[#181818]"
            as="a"
          >
            <IoIosArrowDropdownCircle size={32} />
          </Menu.Button>
          <Menu.Items className="shadow-custom absolute text-black bg-white dark:bg-[#343233] dark:text-white rounded-xl text-left w-60 px-4 py-2 right-4 top-16 mt-2 display-flex flex-col">
            {accountDropdown === 'main' ? (
              <>
                {data.isLogged && (
                  <Link href={`/${data.isLogged.username}`}>
                    <>
                      <a className="hidden sm:flex my-3 hover:text-green-400">
                        <FaUserCircle className="mr-4" size={24} />
                        Profile
                      </a>
                      <a
                        href={`/${data.isLogged.username}`}
                        className="sm:hidden flex items-center hover:text-green-400 w-full p-2 mr-2"
                      >
                        <div className="relative rounded-full w-8 h-8 mr-1">
                          <Image
                            src={`https://avatars.dicebear.com/api/initials/${data.isLogged.firstName}%20${data.isLogged.lastName}.svg`}
                            layout="fill"
                            objectFit="contain"
                            objectPosition="center"
                            className="rounded-full"
                            alt="Profile picture"
                          />
                        </div>
                        <div>
                          {data.isLogged.firstName} {data.isLogged.lastName}
                        </div>
                      </a>
                    </>
                  </Link>
                )}
                <Link href="/">
                  <a className="sm:hidden flex my-3 hover:text-green-400">
                    <MdPeople className="mr-4" size={24} />
                    Friends
                  </a>
                </Link>
                <Link href="/settings">
                  <a className="flex my-3 hover:text-green-400">
                    <IoMdSettings className="mr-4" size={24} />
                    Settings
                  </a>
                </Link>
                <div
                  className="py-1.5 hover:text-green-400 cursor-pointer"
                  onClick={() => setAccountDropdown('display')}
                >
                  Display {'>'}
                </div>
                {data.isLogged ? (
                  <a
                    className="flex my-3"
                    onClick={() => {
                      LogOut();
                    }}
                  >
                    <RiLogoutBoxFill className="mr-4" size={24} />
                    Log out
                  </a>
                ) : (
                  <Link href="/login">
                    <a className="flex my-3">
                      <RiLoginBoxFill className="mr-4" size={24} />
                      Log in
                    </a>
                  </Link>
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
        <Link href="/map">
          <a className="mt-3 mr-3 float-right">
            <FaMapMarkedAlt className="" size={24} />
          </a>
        </Link>
        {data!.isLogged && (
          <a className="mt-3 mr-3 float-right">
            <MdNotificationsActive className="" size={24} />
          </a>
        )}
        {data.isLogged && (
          <a
            href={`/${data.isLogged.username}`}
            className="flex items-center  text-white float-right p-2 mr-2"
          >
            <div className="relative rounded-full w-8 h-8 mr-1">
              <Image
                src={`https://avatars.dicebear.com/api/initials/${data.isLogged.firstName}%20${data.isLogged.lastName}.svg`}
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                className="rounded-full"
                alt="Profile picture"
              />
            </div>
            <div>{data.isLogged.firstName}</div>
          </a>
        )}
      </div>
    </div>
  );
};

export default Navbar;
