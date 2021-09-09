import Link from 'next/link';
import Image from 'next/image';
import React, { FC } from 'react';

import { IoMdSettings } from 'react-icons/io';
import { MdNotificationsActive, MdPeople } from 'react-icons/md';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { AiFillPlusCircle } from 'react-icons/ai';

const LeftColumn: FC = () => {
  return (
    <>
      <div className="w-full h-auto p-[1em] bg-[#343233] rounded-xl">
        <div className="flex items-center text-white">
          <div className="relative rounded-full w-12 h-12 mr-4">
            <Image
              src={`https://avatars.dicebear.com/api/initials/${'John'}%20${'Doe'}.svg`}
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              className="rounded-full"
              alt="Profile picture"
            />
          </div>
          <div className="font-semibold text-lg"> John Doe</div>
        </div>
        <div className="flex flex-col text-white ml-3">
          <Link href="/createPost">
            <a className="flex mt-6">
              <AiFillPlusCircle className="mr-4" size={24} />
              Create post
            </a>
          </Link>
          <a className="flex mt-6">
            <MdNotificationsActive className="mr-4" size={24} />
            Notifications
          </a>
          <Link href="/">
            <a className="flex mt-6">
              <MdPeople className="mr-4" size={24} />
              Friends
            </a>
          </Link>
          <Link href="/map">
            <a className="flex mt-6">
              <FaMapMarkedAlt className="mr-4" size={24} />
              Map
            </a>
          </Link>
          <Link href="/settings">
            <a className="flex mt-6">
              <IoMdSettings className="mr-4" size={24} />
              Settings
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LeftColumn;
