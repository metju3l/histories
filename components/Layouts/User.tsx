import { LeftPanel } from '@components/Modules/UserPage/LeftPanel';
import { SubNav } from '@components/Modules/UserPage/Subnav';
import { UserQuery } from '@graphql/user.graphql';
import React from 'react';

import UrlPrefix from '../../shared/config/UrlPrefix';
import { Layout } from '.';

type UserLayoutProps = { userQuery: UserQuery; currentTab: string };

const UserLayout: React.FC<UserLayoutProps> = ({
  userQuery,
  currentTab,
  children,
}) => {
  const user = userQuery.user;

  return (
    <Layout
      head={{
        title: `${user.firstName} ${user.lastName} | hiStories`,
        description: `${user.firstName} ${user.lastName}'s profile on HiStories`,
        canonical: 'https://www.histories.cc/user/krystofex',
        openGraph: {
          title: `${user.firstName} ${user.lastName} | HiStories`,
          type: 'website',
          images: [
            {
              url: user.profile.startsWith('http')
                ? user.profile
                : UrlPrefix + user.profile,
              width: 92,
              height: 92,
              alt: `${user.firstName} ${user.lastName}'s profile picture`,
            },
          ],
          url: 'https://www.histories.cc/user/krystofex',
          description: `${user.firstName} ${user.lastName}'s profile`,
          site_name: 'Profil page',
          profile: user,
        },
      }}
    >
      <div className="w-full h-64 bg-brand" />
      <div className="flex px-4 m-auto max-w-screen-2xl">
        <LeftPanel userQuery={userQuery} />
        <div className="w-full">
          {/* SUBNAV */}
          <SubNav currentTab={currentTab} user={user} />
          <main>{children}</main>
        </div>
      </div>
    </Layout>
  );
};

export default UserLayout;
