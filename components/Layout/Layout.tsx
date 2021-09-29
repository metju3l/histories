import React from 'react';
import { Navbar } from '@components/Navbar';
import Head from 'next/head';
import { useCheckIfLoggedQuery } from '@graphql/user.graphql';

type LayoutProps = { title: string; children: React.ReactNode };

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const checkIfLoggedQuery = useCheckIfLoggedQuery();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
    </div>
  );
};

export default Layout;
