import { ProfileLayout } from '@components/Layout';
import SubmitButton from '@components/LoadingButton/SubmitButton';
import { AccountCreatedCard, PostCard } from '@components/PostCard';
import {
  useFollowMutation,
  useUnfollowMutation,
} from '@graphql/relations.graphql';
import { useUpdateProfileMutation } from '@graphql/user.graphql';
import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { NextPageContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import { toast } from 'react-hot-toast';

const User: FC<{ username: string }> = ({ username }) => {
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const logged = useIsLoggedQuery();

  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProfileMutation] = useUpdateProfileMutation();

  if (error) {
    console.log(error);
    return <div>error...</div>;
  }
  if (loading) return <div>loading</div>;
  if (logged.loading) return <div>loading</div>;
  if (logged.error) {
    console.log(logged.error);
    return <div>error</div>;
  }
  if (data === null || data === undefined)
    return <div>user does not exist</div>;
  const isLogged = logged.data!.isLogged;

  return (
    <ProfileLayout
      title={`${data.user.username} | hiStories`}
      leftColumn={
        <div className="sticky top-40">
          {/* PROFILE PICTURE */}
          <div className="absolute w-48 h-48 rounded-full shadow-2xl mt-[-40px]">
            <Image
              src={GeneratedProfileUrl(data.user.firstName, data.user.lastName)}
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              className="rounded-full"
              alt="Profile picture"
            />
          </div>
          {/* PROFILE INFO */}
          <div className="pt-[11rem]">
            {/* NAME */}
            <h1 className="flex items-center text-4xl text-white">
              {data.user.firstName} {data.user.lastName}
              {/* NEW USER BADGE */}
              {new Date().getTime() - data.user.createdAt < 129600000 && (
                <div className="px-4 py-2 ml-4 text-xl bg-[#a535fa96] rounded-2xl">
                  new user
                </div>
              )}
            </h1>
            {/* USERNAME */}
            <Link href={'/' + data.user.username} passHref>
              <h2 className="pt-2 text-3xl cursor-pointer text-[#0ACF83]">
                @{data.user.username}
              </h2>
            </Link>
            <p className="flex pt-4 text-2xl text-white gap-8">
              {/* FOLLOWERS */}
              <h2 className="cursor-pointer">
                {data.user.followers?.length}
                <br />
                <span className="text-xl opacity-70">Followers</span>
              </h2>
              {/* FOLLOWING */}
              <h2 className="cursor-pointer">
                {data.user.following?.length}
                <br />
                <span className="text-xl opacity-70">Following</span>
              </h2>
            </p>
            {isLogged &&
              /* FOLLOW BUTTON */
              (logged.data?.isLogged!.id !== data.user.id ? (
                <div className="pt-6">
                  <FollowButton data={data} refetch={refetch} />
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
            <p className="mt-4 text-white">{data.user.bio}</p>
          </div>
        </div>
      }
      rightColumn={
        <>
          {data.user.posts &&
            data.user.posts.map((post: any) => (
              <PostCard key={post!.id} id={post!.id} isLoggedQuery={logged} />
            ))}
          <AccountCreatedCard
            date={data.user.createdAt}
            firstName={data.user.firstName}
          />
        </>
      }
      menu={
        <>
          {' '}
          <Link href={'/' + data.user.username} passHref>
            <button className="px-6 py-2 text-gray-200 bg-[#484A4D] rounded-xl">
              Posts
            </button>
          </Link>
          <Link href={'/' + data.user.username + '/collections'} passHref>
            <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
              Collections
            </button>
          </Link>
          <Link href={'/' + data.user.username + '/map'} passHref>
            <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
              Map
            </button>
          </Link>
          {logged.data?.isLogged?.id === data.user.id && (
            <Link href={'/settings'} passHref>
              <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
                Settings
              </button>
            </Link>
          )}
        </>
      }
    />
  );
};

export const getServerSideProps = async (
  context: NextPageContext
): Promise<{
  props: {
    username: string;
  };
}> => {
  return {
    props: {
      // @ts-ignore
      username: context.query.username.toString(),
    },
  };
};
const Input: FC<{
  type: string;
  name: string;
  autoComplete: string;
  label: string;
}> = ({ type, name, autoComplete, label }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field
        type={type}
        className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name={name}
        autoComplete={autoComplete}
      />
      <ErrorMessage name={name} />
      <br />
    </div>
  );
};

const FollowButton = ({ data, refetch }: any) => {
  const [followMutation] = useFollowMutation();
  const [unfollowMutation] = useUnfollowMutation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SubmitButton
      text={data.user.isFollowing ? 'Unfollow' : 'Follow'}
      backgroundClassname={
        data.user.isFollowing
          ? 'bg-[#0ACF83] hover:opacity-90'
          : 'bg-[#474DFE] hover:opacity-90'
      }
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          if (data.user.isFollowing) {
            await unfollowMutation({
              variables: { userID: data.user.id },
            });
          } else {
            await followMutation({
              variables: { userID: data.user.id },
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

export default User;
