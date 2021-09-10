import React, { FC, useState } from 'react';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import useDarkMode from '@hooks/useDarkmode';
import Image from 'next/image';
import { MdNotificationsActive } from 'react-icons/md';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { BiSearchAlt2 } from 'react-icons/bi';

const Navbar: FC<{ data: any }> = ({ data }) => {
  // @ts-ignore
  const [theme, setTheme] = useDarkMode();
  const [accountDropdown, setAccountDropdown] = useState('main');

  return (
    <>
      <div className="hidden sm:block w-full text-xm bg-[#212529] text-white cursor-pointer h-14 sticky top-0 z-20">
        <Link href="/" passHref>
          <a className="float-left p-4 hover:bg-[#181818]">LOGO</a>
        </Link>

        <div className="flex float-left bg-white rounded-full text-black p-1 px-2 mt-3">
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
          <Menu.Items className="shadow-custom absolute bg-white text-blue-500 rounded-xl text-left w-60 px-4 py-2 right-4 top-16 mt-2 display-flex flex-col">
            {accountDropdown === 'main' ? (
              <>
                {data.isLogged && (
                  <div className="py-1.5 hover:text-green-400 cursor-pointer ">
                    <Link href={`/${data.isLogged.username}`}> Profile</Link>
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
                    <Link href="/logout"> Log out</Link>
                  </div>
                ) : (
                  <div className="py-1.5 hover:text-green-400 cursor-pointer">
                    <Link href="/login"> Log in</Link>
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
        <Link href="/map">
          <a className="mt-3 mr-3 float-right">
            <FaMapMarkedAlt className="" size={24} />
          </a>
        </Link>
        <a className="mt-3 mr-3 float-right">
          <MdNotificationsActive className="" size={24} />
        </a>
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
      {/* Phone navbar */}
    </>
  );
};

export default Navbar;
