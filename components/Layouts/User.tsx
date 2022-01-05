import { LeftPanel } from '@components/Modules/UserPage/LeftPanel';
import { SubNav } from '@components/Modules/UserPage/Subnav';
import HeadProps from '@lib/types/head';
import React, { useState } from 'react';

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
  const [view, setView] = useState<'grid' | 'list'>('list');

  return (
    <Layout head={head}>
      <div className="w-full h-64 bg-brand" />
      <div className="px-4 m-auto grid grid-cols-12 lg:gap-8 max-w-screen-2xl gap-6">
        <LeftPanel user={user} />
        <div className="lg:col-span-8 md:col-span-12 col-span-12 space-y-2">
          {/* SUBNAV */}
          <SubNav
            currentTab={currentTab}
            user={user}
            view={view}
            setView={setView}
          />
          <main className="w-full h-full">{children}</main>
        </div>
      </div>
    </Layout>
  );
};

export default UserLayout;
