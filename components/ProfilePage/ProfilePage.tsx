import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import React, { ReactNode } from 'react';

import Layout from '../Layout/Layout';
import LeftPanel from './LeftPanel';

const ProfilePage: React.FC<{
  rightColumn: ReactNode;
  menu: ReactNode;
  title: string;
  username: string;
}> = ({ menu, rightColumn, title, username }) => {
  const loggedQuery = useIsLoggedQuery();
  const userQuery = useGetUserInfoQuery({
    variables: { username: username },
  });

  if (loggedQuery.loading || userQuery.loading) return <div>loading</div>;
  if (loggedQuery.error || userQuery.error) return <div>loading</div>;

  return (
    <Layout title={title}>
      {/* HEADER */}
      <main className="w-full h-32 shadow-2xl bg-[#242427]"></main>
      {/* MAIN CONTENT */}
      <div className="w-full h-auto min-h-screen bg-[#19191B]">
        <main className="flex w-full m-auto max-w-7xl">
          <div className="w-[38rem]">
            <LeftPanel username={username} />
          </div>
          <div className="w-full" style={{ gridColumnStart: 2 }}>
            <div className="flex w-full h-auto pt-4 pb-8 gap-4">{menu}</div>
            {rightColumn}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ProfilePage;
