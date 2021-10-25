import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ICONS
import { AiFillPlusCircle } from 'react-icons/ai';
import { MdNotificationsActive, MdPeople } from 'react-icons/md';
import { RiLoginBoxFill } from 'react-icons/ri';
import { IoMdSettings } from 'react-icons/io';
import { FaMapMarkedAlt } from 'react-icons/fa';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';

const Menu: FC<{ data: any }> = ({ data }) => {
  return (
    <>
      <div className="w-full h-auto p-[1em] bg-white shadow-lg dark:bg-[#343233] rounded-xl text-text-light dark:text-white">
        {data?.isLogged && (
          <Link href={`/${data?.isLogged.username}`}>
            <a className="flex items-center">
              <div className="relative rounded-full w-12 h-12 mr-4">
                <Image
                  src={GeneratedProfileUrl(
                    data!.isLogged.firstName,
                    data!.isLogged.lastName
                  )}
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  className="rounded-full"
                  alt="Profile picture"
                />
              </div>
              <div>
                <a className="font-semibold text-lg">
                  {`${data!.isLogged.firstName} ${data!.isLogged.lastName}`}
                </a>
                <br />@{data!.isLogged.username}
              </div>
            </a>
          </Link>
        )}
        <div className="flex flex-col ml-3">
          {data!.isLogged && (
            <Link href="/createPost">
              <a className="flex my-3">
                <AiFillPlusCircle className="mr-4" size={24} />
                Create post
              </a>
            </Link>
          )}
          {data!.isLogged && (
            <a className="flex my-3">
              <MdNotificationsActive className="mr-4" size={24} />
              Notifications
            </a>
          )}
          {data!.isLogged && (
            <Link href="/">
              <a className="flex my-3">
                <MdPeople className="mr-4" size={24} />
                Friends
              </a>
            </Link>
          )}
          {!data!.isLogged && (
            <Link href="/login">
              <a className="flex my-3">
                <RiLoginBoxFill className="mr-4" size={24} />
                Log in
              </a>
            </Link>
          )}
          <Link href="/map">
            <a className="flex my-3">
              <FaMapMarkedAlt className="mr-4" size={24} />
              Map
            </a>
          </Link>
          <Link href="/settings">
            <a className="flex my-3">
              <IoMdSettings className="mr-4" size={24} />
              Settings
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Menu;
