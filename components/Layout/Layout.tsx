import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { Navbar } from '@components/Navbar';
import { IsLoggedQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import Head from 'next/head';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import ProtectedRoutes from './ProtectedRoutes';

type LayoutProps = {
  title: string;
  dontRedirectUnverified?: boolean;
  redirectLogged?: boolean;
  redirectNotLogged?: boolean;
  children: React.ReactNode;
};

export const LoginContext = React.createContext<{
  data: IsLoggedQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (() => Promise<ApolloQueryResult<IsLoggedQuery>>) | undefined;
}>({
  data: undefined,
  loading: true,
  error: undefined,
  refetch: undefined,
});

const Layout: React.FC<LayoutProps> = ({
  title,
  dontRedirectUnverified,
  redirectLogged,
  redirectNotLogged,
  children,
}) => {
  const { data, loading, error, refetch } = useIsLoggedQuery();

  return (
    <LoginContext.Provider value={{ data, loading, error, refetch }}>
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
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            name="keywords"
            content="DELTA - Střední škola informatiky a ekonomie, s.r.o."
          />
          <link rel="icon" href="/icons/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link
            href="/icons/icon-72x72.png"
            rel="icon"
            type="image/png"
            sizes="72x72"
          />
          <link
            href="/icons/icon-512x512.png"
            rel="icon"
            type="image/png"
            sizes="512x512"
          />
          <link
            rel="apple-touch-icon"
            href="/icons/apple-touch-icon.jpg"
          ></link>
          <meta name="theme-color" content="#17A6FA" />
        </Head>
        <Toaster position="top-center" reverseOrder={true} />

        <div className="absolute w-full bg-gray-900 h-[3.8rem]"> </div>
        <div className="sticky top-0 z-50 backdrop-filter backdrop-blur">
          <Navbar />
        </div>
        {children}
      </div>
    </LoginContext.Provider>
  );
};

export default Layout;
