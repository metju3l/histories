import UserDoesNotExist from '@components/Modules/404/UserDoesNotExist';
import { useGetUserInfoQuery } from '@graphql/user.graphql';
import UrlPrefix from '@lib/functions/UrlPrefix';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Layout } from '.';

type UserLayoutProps = { username: string };

const UserLayout: React.FC<UserLayoutProps> = ({ username, children }) => {
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  if (data === undefined) return <UserDoesNotExist />;

  const user = data.user;

  return (
    <Layout
      head={{
        title: `${data.user.username} | hiStories`,
        description: `${data.user.username}'s profile on HiStories`,
        canonical: 'https://www.histories.cc/user/krystofex',
        openGraph: {
          title: `${data.user.username} | HiStories`,
          type: 'website',
          images: [
            {
              url: UrlPrefix + data.user.profile,
              width: 92,
              height: 92,
              alt: `${data.user.username}'s profile picture`,
            },
          ],
          url: 'https://www.histories.cc/user/krystofex',
          description: `${data.user.username}'s profile`,
          site_name: 'Profil page',
          profile: data.user,
        },
      }}
    >
      <div className="sticky top-40">
        {/* PROFILE PICTURE */}
        <div className="absolute rounded-full shadow-md bg-secondary w-[10rem] h-[10rem] mt-[-40px]">
          <Link href={'/user/' + username} passHref>
            <Image
              src={UrlPrefix + user.profile}
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              className="rounded-full"
              alt="Profile picture"
            />
          </Link>
        </div>
        {/* PROFILE INFO */}
        <div className="pt-[9rem]">
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
              <span className="text-xl text-secondary opacity-70">
                Followers
              </span>
            </h2>
            {/* FOLLOWING */}
            <h2 className="cursor-pointer">
              {user.following?.length}
              <br />
              <span className="text-xl text-secondary opacity-70">
                Following
              </span>
            </h2>
          </p>

          {/* BIO */}
          <p className="mt-4 text-primary">{user.bio}</p>
        </div>
      </div>
    </Layout>
  );
};

export default UserLayout;
