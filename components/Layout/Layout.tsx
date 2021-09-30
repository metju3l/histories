import React from 'react';
import { Navbar } from '@components/Navbar';
import Head from 'next/head';
import ProtectedRoutes from './ProtectedRoutes';

type LayoutProps = {
  title: string;
  dontRedirectUnverified?: boolean;
  redirectLogged?: boolean;
  redirectNotLogged?: boolean;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({
  title,
  dontRedirectUnverified,
  redirectLogged,
  redirectNotLogged,
  children,
}) => {
  return (
    <div>
      {(dontRedirectUnverified !== true ||
        redirectLogged ||
        redirectNotLogged) && (
        <ProtectedRoutes
          dontRedirectUnverified={dontRedirectUnverified}
          redirectLogged={redirectLogged}
          redirectNotLogged={redirectNotLogged}
        />
      )}
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
    </div>
  );
};

export default Layout;
