import { Maybe } from '../../../../.cache/__types__';
import { Tooltip } from '@components/Elements';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import UrlPrefix from '../../../../shared/config/UrlPrefix';

export type UserLeftPanelProps = {
  user: {
    username: string;
    firstName: string;
    lastName: string;
    profile: string;
    verified: boolean;

    createdAt: string;
    followerCount: number;
    followingCount: number;
    postCount: number;

    bio: Maybe<string>;
  };
};

const UserLeftPanel: React.FC<UserLeftPanelProps> = ({ user }) => {
  return (
    <div className="relative top-0 lg:sticky lg:col-span-4 md:col-span-12 col-span-12">
      {/* PROFILE PICTURE */}
      <Link href={'/user/' + user.username} passHref>
        <div className="relative -mt-24 bg-white border-8 border-white rounded-full w-28 h-28 sm:h-40 sm:w-40 transition-all duration-400 ease-in-out">
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
        <h1 className="flex items-center text-2xl font-bold gap-1.5">
          {user.firstName} {user.lastName}
        </h1>

        <div className="flex gap-2">
          {/* USERNAME */}
          <Link href={'/' + user.username} passHref>
            <h2 className="text-xl text-black truncate bg-clip-text">
              @{user.username}
            </h2>
          </Link>
          {/* NEW USER BADGE */}
          {new Date().getTime() - new Date(user.createdAt).getTime() <
            129600000 && (
            <Tooltip text="This account was created less than 2 days ago">
              <div className="items-center block px-3 py-1 text-xs font-semibold text-green-500 bg-white border border-green-500 rounded-full space-x-1.5 dark:bg-gray-800 shadown-sm dark:border-gray-700 w-max">
                new user
              </div>
            </Tooltip>
          )}
          {user.verified && (
            <div className="items-center block px-3 py-1 text-xs font-semibold text-green-500 border-green-500 rounded-full space-x-1.5 shadown-sm w-max">
              verified
            </div>
          )}
        </div>

        <p className="flex pt-4 text-xl text-primary gap-8">
          {/* FOLLOWERS COUNT */}
          <h4 className="flex flex-col text-base font-medium cursor-pointer">
            <span className="text-black">{user.followerCount}</span>
            <span className="text-gray-500">{' Followers'}</span>
          </h4>
          {/* FOLLOWING COUNT */}
          <h4 className="flex flex-col text-base font-medium cursor-pointer">
            <span className="text-black">{user.followingCount}</span>
            <span className="text-gray-500">{' Following'}</span>
          </h4>
          {/* POSTS COUNT */}
          <h4 className="flex flex-col text-base font-medium cursor-pointer">
            <span className="text-black">{user.postCount}</span>
            <span className="text-gray-500">
              {user.postCount == 1 ? ' Post' : ' Posts'}
            </span>
          </h4>
        </p>

        {/* BIO */}
        <p className="mt-4 font-medium text-black">{user.bio}</p>
      </div>
    </div>
  );
};

export default UserLeftPanel;
