import { ApolloError, ApolloQueryResult } from '@apollo/client';
import Head from 'next/head';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import {
  IsLoggedQuery,
  useIsLoggedQuery,
} from '../../lib/graphql/user.graphql';
import { Navbar } from '../Navbar';
import ProtectedRoutes from './ProtectedRoutes';

type LayoutProps = {
  title: string;
  dontRedirectUnverified?: boolean;
  redirectLogged?: boolean;
  redirectNotLogged?: boolean;
  children: React.ReactNode;
};

export type LoginContextType = {
  data: IsLoggedQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (() => Promise<ApolloQueryResult<IsLoggedQuery>>) | undefined;
};

export const LoginContext = React.createContext<LoginContextType>({
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
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.jpg"></link>
        <meta name="description" content="hiStories" />
        <link rel="manifest" href="manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#17A6FA" />
      </Head>
      <Toaster position="top-center" reverseOrder={true} />
      {(dontRedirectUnverified !== true ||
        redirectLogged ||
        redirectNotLogged) && (
        <ProtectedRoutes
          dontRedirectUnverified={dontRedirectUnverified}
          redirectLogged={redirectLogged}
          redirectNotLogged={redirectNotLogged}
        />
      )}

      <Navbar />
      <div className="h-screen bg-white md:pt-14">{children}</div>
    </LoginContext.Provider>
  );
};

export default Layout;
