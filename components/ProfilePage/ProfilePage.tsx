import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import React, { ReactNode } from 'react';

import Layout from '../Layout/Layout';
import LeftPanel from './LeftPanel';
import ProfileNavigation from './ProfileNavigation';

const ProfilePage: React.FC<{
  rightColumn: ReactNode;
  title: string;
  username: string;
}> = ({ rightColumn, title, username }) => {
  const loggedQuery = useIsLoggedQuery();
  const userQuery = useGetUserInfoQuery({
    variables: { username: username },
  });

  if (loggedQuery.loading || userQuery.loading) return <div>loading</div>;
  if (loggedQuery.error || userQuery.error || userQuery.data === undefined)
    return <div>loading</div>;

  return (
    <Layout title={title}>
      {/* HEADER */}
      <main className="w-full h-32 shadow-2xl bg-tertiary"></main>
      {/* MAIN CONTENT */}
      <div className="w-full h-auto min-h-screen bg-secondary">
        <main className="flex w-full m-auto max-w-7xl">
          <div className="w-[38rem]">
            <LeftPanel username={username} />
          </div>
          <div className="w-full" style={{ gridColumnStart: 2 }}>
            <ProfileNavigation
              loggedQuery={loggedQuery}
              userQuery={userQuery}
            />
            {rightColumn}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ProfilePage;
