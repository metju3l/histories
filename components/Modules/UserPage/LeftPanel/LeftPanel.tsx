import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import UrlPrefix from '../../../../shared/config/UrlPrefix';

export type UserLeftPanelProps = { user: any };

const UserLeftPanel: React.FC<UserLeftPanelProps> = ({ user }) => {
  return (
    <div className="relative top-0 lg:sticky lg:col-span-4 md:col-span-12 col-span-12">
      {/* PROFILE PICTURE */}
      <Link href={'/user/' + user.username} passHref>
        <div className="relative -mt-24 w-28 h-28 sm:h-40 sm:w-40 transition-all duration-400 ease-in-out">
          <Image
            src={
              user.profile.startsWith('http')
                ? user.profile
                : UrlPrefix + user.profile
            }
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            className="rounded-full"
            alt="Profile picture"
          />
        </div>
      </Link>
      {/* PROFILE INFO */}
      <div className="pt-4">
        {/* NAME */}
        <h1 className="flex items-center text-3xl font-semibold text-primary">
          {user.firstName} {user.lastName}
          {/* NEW USER BADGE */}
          {new Date().getTime() - user.createdAt < 129600000 && (
            <div className="px-4 py-2 ml-4 text-xl text-white bg-[#a535fa96] rounded-2xl">
              new user
            </div>
          )}
        </h1>
        {/* USERNAME */}
        <Link href={'/' + user.username} passHref>
          <h2 className="pt-2 text-2xl cursor-pointer text-secondary">
            @{user.username}
          </h2>
        </Link>
        <p className="flex pt-4 text-2xl text-primary gap-8">
          {/* FOLLOWERS */}
          <h2 className="cursor-pointer">
            {user.followers?.length}
            <br />
            <span className="text-xl text-secondary opacity-70">Followers</span>
          </h2>
          {/* FOLLOWING */}
          <h2 className="cursor-pointer">
            {user.following?.length}
            <br />
            <span className="text-xl text-secondary opacity-70">Following</span>
          </h2>
        </p>

        {/* BIO */}
        <p className="mt-4 text-primary">{user.bio}</p>
      </div>
    </div>
  );
};

export default UserLeftPanel;
