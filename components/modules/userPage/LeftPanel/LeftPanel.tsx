import { Button, Tooltip } from '@components/elements';
import {
  useFollowMutation,
  useUnfollowMutation,
} from '@graphql/relations.graphql';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { Maybe } from '../../../../.cache/__types__';
import { LoginContext } from '../../../../pages/_app';
import UrlPrefix from '../../../../shared/config/UrlPrefix';

export type UserLeftPanelProps = {
  user: {
    id: number;
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
    isFollowing: boolean;
  };
};

const UserLeftPanel: React.FC<UserLeftPanelProps> = ({ user }) => {
  const [follow] = useFollowMutation(); // follow mutation
  const [unfollow] = useUnfollowMutation(); // unfollow mutation
  // save numbers to variables so I can update data on user page without refetching
  const [localFollowingState, setLocalFollowingState] = useState<boolean>(
    user.isFollowing
  );
  // number of followers without logged user to possibility of updating data without refetching
  const followerCountWithoutMe =
    user.followerCount - (user.isFollowing ? 1 : 0);

  const loginContext = React.useContext(LoginContext);
  const { t } = useTranslation();

  return (
    <div className="relative top-0 lg:sticky lg:col-span-4 md:col-span-12 col-span-12">
      {/* PROFILE PICTURE */}
      <Link href={'/user/' + user.username} passHref>
        <div className="relative -mt-8 border-8 rounded-full sm:-mt-14 bg-[#FAFBFB] dark:bg-[#171716] border-[#FAFBFB] dark:border-[#171716] w-28 h-28 sm:h-40 sm:w-40 transition-all duration-400 ease-in-out">
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
            quality={50}
          />
        </div>
      </Link>
      {/* PROFILE INFO */}
      <div className="pt-2 sm:pt-4 transition-all ease-in-out duration-400">
        {/* NAME */}
        <h1 className="flex items-center text-2xl font-bold gap-1.5">
          {user.firstName} {user.lastName}
        </h1>

        <div className="flex items-center gap-2">
          {/* USERNAME */}
          <Link href={'/' + user.username} passHref>
            <h2 className="text-xl text-black truncate dark:text-gray-300 bg-clip-text">
              @{user.username}
            </h2>
          </Link>
          {/* NEW USER BADGE */}
          {new Date().getTime() - new Date(user.createdAt).getTime() <
            129600000 && (
            <Tooltip text="This account was created less than 2 days ago">
              <div className="items-center block px-3 py-1 text-xs font-semibold text-green-500 bg-white border border-green-500 rounded-full space-x-1.5 dark:bg-gray-800 shadown-sm dark:border-gray-700 w-max">
                {t('new_user')}
              </div>
            </Tooltip>
          )}
          {user.verified && (
            <div className="items-center block px-3 py-1 text-xs font-semibold text-green-500 border border-green-500 rounded-full space-x-1.5 shadown-sm w-max">
              {t('verified_user')}
            </div>
          )}
        </div>

        <p className="flex pt-4 text-xl text-primary gap-8">
          {/* FOLLOWERS COUNT */}
          <h4 className="flex flex-col text-base font-medium cursor-pointer">
            <span className="text-black dark:text-gray-300">
              {followerCountWithoutMe + (localFollowingState ? 1 : 0)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {t('followers')}
            </span>
          </h4>
          {/* FOLLOWING COUNT */}
          <h4 className="flex flex-col text-base font-medium cursor-pointer">
            <span className="text-black dark:text-gray-300">
              {user.followingCount}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {t('following')}
            </span>
          </h4>
          {/* POSTS COUNT */}
          <h4 className="flex flex-col text-base font-medium cursor-pointer">
            <span className="text-black dark:text-gray-300">
              {user.postCount}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {t('post_count')}
            </span>
          </h4>
        </p>

        {/* BIO */}
        <p className="mt-4 font-medium text-black dark:text-white">
          {user.bio}
        </p>
        {loginContext.data?.me?.id === user.id ? (
          <Link href="/settings" passHref>
            <button className="items-center block px-3 py-1 mt-6 text-xs font-semibold text-gray-500 border border-gray-500 rounded-full space-x-1.5 shadown-sm w-max">
              {t('edit_profile')}
            </button>
          </Link>
        ) : (
          loginContext.data?.me?.id && (
            <Button
              onClick={async () => {
                try {
                  // if following, run unfollow mutation
                  if (localFollowingState) {
                    setLocalFollowingState(false); // change local state to avoid refetch
                    await unfollow({
                      variables: {
                        userID: user.id,
                      },
                    });
                  }
                  // if not following, run follow mutation
                  else {
                    setLocalFollowingState(true); // change local state to avoid refetch
                    await follow({
                      variables: {
                        userID: user.id,
                      },
                    });
                  }
                } catch (error: any) {
                  toast.error(error.message);
                }
              }}
            >
              {localFollowingState ? t('unfollow') : t('follow')}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default UserLeftPanel;
