import { LeftPanel } from '@components/Modules/UserPage/LeftPanel';
import { SubNav } from '@components/Modules/UserPage/Subnav';
import HeadProps from '@lib/types/head';
import React from 'react';

import { Layout } from '.';

type UserLayoutProps = {
  user: any;
  currentTab: string;
  head: HeadProps;
};

const UserLayout: React.FC<UserLayoutProps> = ({
  head,
  user,
  currentTab,
  children,
}) => {
  return (
    <Layout head={head}>
      <div className="w-full h-64 bg-brand" />
      <div className="flex px-4 m-auto max-w-screen-2xl gap-6 bg-[#FAFBFB]">
        <LeftPanel user={user} />
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
