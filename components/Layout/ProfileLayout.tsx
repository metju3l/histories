import React, { ReactNode } from 'react';

import Layout from './Layout';

const ProfileLayout: React.FC<{
  leftColumn: ReactNode;
  rightColumn: ReactNode;
  menu: ReactNode;
  title: string;
}> = ({ leftColumn, menu, rightColumn, title }) => {
  return (
    <Layout title={title}>
      {/* HEADER */}
      <main className="w-full h-32 shadow-2xl bg-[#242427]"></main>
      {/* MAIN CONTENT */}
      <div className="w-full h-auto min-h-screen bg-[#19191B]">
        <main className="flex w-full m-auto max-w-7xl">
          <div className="w-[38rem]">{leftColumn}</div>
          <div className="w-full" style={{ gridColumnStart: 2 }}>
            <div className="flex w-full h-auto pt-4 pb-8 gap-4">{menu}</div>
            {rightColumn}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ProfileLayout;
