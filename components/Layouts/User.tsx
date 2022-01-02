import UserDoesNotExist from '@components/Modules/404/UserDoesNotExist';
import { useGetUserInfoQuery } from '@graphql/user.graphql';
import UrlPrefix from 'shared/config/UrlPrefix';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { LoginContext } from '../../pages/_app';
import { Layout } from '.';

type UserLayoutProps = { username: string; currentTab: string };

const UserLayout: React.FC<UserLayoutProps> = ({
  username,
  currentTab,
  children,
}) => {
  // login context
  const loginContext = React.useContext(LoginContext);

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
        title: `${data.user.firstName} ${data.user.lastName} | hiStories`,
        description: `${data.user.firstName} ${data.user.lastName}'s profile on HiStories`,
        canonical: 'https://www.histories.cc/user/krystofex',
        openGraph: {
          title: `${data.user.firstName} ${data.user.lastName} | HiStories`,
          type: 'website',
          images: [
            {
              url: data.user.profile.startsWith('http')
                ? data.user.profile
                : UrlPrefix + data.user.profile,
              width: 92,
              height: 92,
              alt: `${data.user.firstName} ${data.user.lastName}'s profile picture`,
            },
          ],
          url: 'https://www.histories.cc/user/krystofex',
          description: `${data.user.firstName} ${data.user.lastName}'s profile`,
          site_name: 'Profil page',
          profile: data.user,
        },
      }}
    >
      <div className="w-full h-64 bg-brand" />
      <div className="flex px-4 m-auto max-w-screen-2xl">
        <div className="sticky top-0">
          {/* PROFILE PICTURE */}
          <Link href={'/user/' + username} passHref>
            <div className="relative -mt-24 w-28 h-28 sm:h-40 sm:w-40 transition-all duration-400 ease-in-out">
              <Image
                src={
                  data.user.profile.startsWith('http')
                    ? data.user.profile
                    : UrlPrefix + data.user.profile
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
        <div className="w-full">
          {/* SUBNAV */}
          <div className="flex w-full px-2 pt-2 gap-3">
            <SubNavItem
              href={`/user/${user.username}`}
              currentTab={currentTab}
              name="posts"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
              Posts
            </SubNavItem>
            <SubNavItem
              href={`/user/${user.username}/collections`}
              currentTab={currentTab}
              name="collections"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 448 512"
                className="w-4 h-4"
              >
                <path
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z"
                />
              </svg>
              Collections
            </SubNavItem>
            <SubNavItem
              href={`/user/${user.username}/map`}
              currentTab={currentTab}
              name="map"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 576 512"
              >
                <path
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M560.02 32c-1.96 0-3.98.37-5.96 1.16L384.01 96H384L212 35.28A64.252 64.252 0 0 0 191.76 32c-6.69 0-13.37 1.05-19.81 3.14L20.12 87.95A32.006 32.006 0 0 0 0 117.66v346.32C0 473.17 7.53 480 15.99 480c1.96 0 3.97-.37 5.96-1.16L192 416l172 60.71a63.98 63.98 0 0 0 40.05.15l151.83-52.81A31.996 31.996 0 0 0 576 394.34V48.02c0-9.19-7.53-16.02-15.98-16.02zM224 90.42l128 45.19v285.97l-128-45.19V90.42zM48 418.05V129.07l128-44.53v286.2l-.64.23L48 418.05zm480-35.13l-128 44.53V141.26l.64-.24L528 93.95v288.97z"
                />
              </svg>
              {`${user.firstName}'s map`}
            </SubNavItem>
            {loginContext.data?.me?.id === user.id && (
              <SubNavItem
                href={`/settings`}
                currentTab={currentTab}
                name="settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="cog"
                  className="w-4 h-4"
                  role="img"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"
                  />
                </svg>
                Settings
              </SubNavItem>
            )}
          </div>
          <main>{children}</main>
        </div>
      </div>
    </Layout>
  );
};

export type SubNavItemProps = {
  href: string;
  name: string;
  currentTab: string;
};

const SubNavItem: React.FC<SubNavItemProps> = ({
  children,
  href,
  name,
  currentTab,
}) => {
  return (
    <Link href={href}>
      <a
        className={`flex items-center px-3 py-1 font-bold ${
          currentTab === name
            ? 'bg-orange-100 text-brand dark:hover:bg-opacity-20 bg-opacity-100 text-brand-500'
            : 'hover:bg-orange-100 hover:text-brand dark:hover:bg-opacity-20 hover:bg-opacity-100 bg-brand-100 text-brand-500 text-gray-500'
        } rounded-lg gap-1 space-x-2`}
      >
        {children}
      </a>
    </Link>
  );
};

export default UserLayout;
