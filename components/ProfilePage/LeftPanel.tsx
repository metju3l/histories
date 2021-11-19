import { Button } from '@components/Button';
import {
  useFollowMutation,
  useUnfollowMutation,
} from '@graphql/relations.graphql';
import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const LeftPanel: React.FC<{
  username: string;
}> = ({ username }) => {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loggedQuery = useIsLoggedQuery();
  const userQuery = useGetUserInfoQuery({
    variables: { username: username },
  });

  if (loggedQuery.loading || userQuery.loading) return <div>loading</div>;
  if (loggedQuery.error || userQuery.error) return <div>loading</div>;

  const user = userQuery.data!.user;
  const isLogged = loggedQuery.data!.isLogged;

  return (
    <div className="sticky top-40">
      {/* PROFILE PICTURE */}
      <div className="absolute bg-gray-700 rounded-full shadow-2xl w-[10rem] h-[10rem] mt-[-40px]">
        {userQuery.data && (
          <Image
            src={GeneratedProfileUrl(user.firstName, user.lastName)}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            className="rounded-full"
            alt="Profile picture"
          />
        )}
      </div>
      {/* PROFILE INFO */}
      <div className="pt-[9rem]">
        {/* NAME */}
        <h1 className="flex items-center text-3xl font-semibold text-white">
          {user.firstName} {user.lastName}
          {/* NEW USER BADGE */}
          {new Date().getTime() - user.createdAt < 129600000 && (
            <div className="px-4 py-2 ml-4 text-xl bg-[#a535fa96] rounded-2xl">
              new user
            </div>
          )}
        </h1>
        {/* USERNAME */}
        <Link href={'/' + user.username} passHref>
          <h2 className="pt-2 text-2xl cursor-pointer text-[#ffffff9a]">
            @{user.username}
          </h2>
        </Link>
        <p className="flex pt-4 text-2xl text-white gap-8">
          {/* FOLLOWERS */}
          <h2 className="cursor-pointer">
            {user.followers?.length}
            <br />
            <span className="text-xl text-[#ffffff9a] opacity-70">
              Followers
            </span>
          </h2>
          {/* FOLLOWING */}
          <h2 className="cursor-pointer">
            {user.following?.length}
            <br />
            <span className="text-xl text-[#ffffff9a] opacity-70">
              Following
            </span>
          </h2>
        </p>
        {isLogged &&
          /* FOLLOW BUTTON */
          (loggedQuery.data?.isLogged!.id !== user.id ? (
            <div className="pt-6">
              <FollowButton
                isFollowing={user.isFollowing}
                id={user.id}
                refetch={userQuery.refetch}
              />
            </div>
          ) : (
            /* EDIT BUTTON */
            <button
              type={isLoading ? 'button' : 'submit'}
              onClick={() => setEditMode(!editMode)}
              className="inline-flex items-center justify-center h-10 mt-6 font-medium tracking-wide text-white rounded-lg bg-[#0ACF83] w-52 transition duration-200 hover:opacity-90"
            >
              {editMode ? 'Save' : 'Edit profile'}
            </button>
          ))}
        {/* BIO */}
        <p className="mt-4 text-white">{user.bio}</p>
      </div>
    </div>
  );
};

const FollowButton = ({ isFollowing, id, refetch }: any) => {
  const [followMutation] = useFollowMutation();
  const [unfollowMutation] = useUnfollowMutation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      text={isFollowing ? 'Unfollow' : 'Follow'}
      backgroundClassname={
        isFollowing
          ? 'bg-[#0ACF83] hover:opacity-90'
          : 'bg-[#474DFE] hover:opacity-90'
      }
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          if (isFollowing) {
            await unfollowMutation({
              variables: { userID: id },
            });
          } else {
            await followMutation({
              variables: { userID: id },
            });
          }
          await refetch();
        } catch (error) {
          // @ts-ignore
          toast.error(error.message);
        }
        setIsLoading(false);
      }}
    />
  );
};

export default LeftPanel;
