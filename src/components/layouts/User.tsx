import { LeftPanel } from '@components/modules/userPage/LeftPanel';
import { SubNav } from '@components/modules/userPage/Subnav';
import HeadProps from '@src/types/head';
import React from 'react';

import { Layout } from '.';

type UserLayoutProps = {
  user: any;
  currentTab: 'posts' | 'collections' | 'map';
  head: HeadProps;
  heading: string;
};

const UserLayout: React.FC<UserLayoutProps> = ({
  head,
  user,
  currentTab,
  children,
  heading,
}) => {
  return (
    <Layout head={head}>
      <div className="w-full h-64 bg-gradient-to-br from-violet-700 to-blue-400" />
      <div className="px-4 m-auto grid grid-cols-12 lg:gap-8 max-w-screen-2xl gap-6 h-[calc(100vh - 300px)]">
        <LeftPanel user={user} />
        <div className="h-full lg:col-span-8 md:col-span-12 col-span-12 space-y-2">
          {/* SUBNAV */}
          <SubNav currentTab={currentTab} user={user} />
          <main className="w-full" style={{ height: 'calc(100vh - 400px)' }}>
            <h1 className="pt-6 text-4xl font-semibold">{heading}</h1>
            {children}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default UserLayout;
