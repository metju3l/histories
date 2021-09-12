import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';

// ICONS
import { FaMapMarkedAlt } from 'react-icons/fa';

const Post: FC = () => {
  return (
    <div className="w-full p-[1em] bg-white shadow-lg dark:bg-[#343233] rounded-xl text-text-light dark:text-white mb-8">
      <div className="flex items-center">
        <div className="relative rounded-full w-12 h-12 mr-4">
          <Image
            src={GeneratedProfileUrl('John', 'Doe')}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            className="rounded-full"
            alt="Profile picture"
          />
        </div>
        <div className="font-semibold text-lg"> John Doe</div>
      </div>
      <div className="relative rounded-xl w-full h-[16em] mt-8">
        <Image
          src={`https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80`}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
          className="rounded-xl"
          alt="Profile picture"
        />
        <div className="absolute right-2 bottom-4 p-2 bg-white shadow-lg dark:bg-[#343233] rounded-xl text-text-light dark:text-white">
          <Link href="/map">
            <a>
              <FaMapMarkedAlt size={24} />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
