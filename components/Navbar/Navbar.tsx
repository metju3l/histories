import React, { FC } from "react";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import useDarkMode from "@lib/hooks/useDarkmode";
import Image from "next/image";
import LogOut from "@lib/functions/LogOut";
import { Switch } from "@nextui-org/react";

// ICONS
import { IoIosArrowDropdownCircle, IoMdSettings } from "react-icons/io";
import { MdNotificationsActive, MdPeople } from "react-icons/md";
import { FaMapMarkedAlt, FaUserCircle } from "react-icons/fa";
import { BiSearchAlt2 } from "react-icons/bi";
import { RiLoginBoxFill, RiLogoutBoxFill } from "react-icons/ri";
import { HiSun, HiMoon } from "react-icons/hi";
import GeneratedProfileUrl from "@lib/functions/GeneratedProfileUrl";

const Navbar: FC<{ data: any }> = ({ data }) => {
  const { theme, setTheme } = useDarkMode();

  return (
    <div className="w-full text-xm bg-white dark:bg-[#343233] text-text-light dark:text-text-dark h-14 sticky top-0 z-20 shadow-sm">
      <div className="max-w-screen-xl m-auto">
        <Link href="/" passHref>
          <a className="float-left p-2 m-2 text-white bg-[#17A6FA] rounded-lg">
            hiStories
          </a>
        </Link>

        <div className="hidden sm:flex float-left bg-[#F0F2F5] rounded-full text-black p-1 px-2 mt-3">
          <BiSearchAlt2 size={24} />
          <input
            type="text"
            className="w-full rounded-sm outline-none border-none inline-block bg-[#F0F2F5] text-light-text"
          />
          <button> x</button>
        </div>

        <Menu>
          <Menu.Button className="float-right py-2 px-4" as="a">
            <IoIosArrowDropdownCircle size={32} />
          </Menu.Button>
          <Menu.Items className="shadow-custom absolute text-black bg-white dark:bg-[#343233] dark:text-white rounded-xl text-left w-60 px-4 py-2 right-4 top-16 mt-2 display-flex flex-col">
            {data.isLogged && (
              <Link href={`/${data.isLogged.username}`}>
                <>
                  <a className="hidden sm:flex my-3">
                    <FaUserCircle className="mr-4" size={24} />
                    Profile
                  </a>
                  <a
                    href={`/${data.isLogged.username}`}
                    className="sm:hidden flex items-center w-full p-2 mr-2"
                  >
                    <div className="relative rounded-full w-8 h-8 mr-1">
                      <Image
                        src={GeneratedProfileUrl(
                          data.isLogged.firstName,
                          data.isLogged.lastName
                        )}
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
              <a className="sm:hidden flex my-3">
                <MdPeople className="mr-4" size={24} />
                Friends
              </a>
            </Link>
            <Link href="/settings">
              <a className="flex my-3">
                <IoMdSettings className="mr-4" size={24} />
                Settings
              </a>
            </Link>
            <div className="py-1.5 cursor-pointer flex items-center">
              Theme
              <Switch
                className="text-black ml-4"
                checked={theme === "dark"}
                size="xlarge"
                iconOn={<HiMoon />}
                iconOff={<HiSun />}
                onChange={(e) => {
                  setTheme(e.target.checked ? "dark" : "light");
                }}
              />
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
            className="flex items-center float-right p-2 mr-2"
          >
            <div className="relative rounded-full w-8 h-8 mr-1">
              <Image
                src={GeneratedProfileUrl(
                  data.isLogged.firstName,
                  data.isLogged.lastName
                )}
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
