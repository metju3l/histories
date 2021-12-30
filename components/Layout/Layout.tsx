import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { NextSeo } from 'next-seo';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import { MeQuery, useMeQuery } from '../../lib/graphql/user.graphql';
import { Navbar } from './Navbar';
import ProtectedRoutes from './ProtectedRoutes';

export type HeadProps = {
  title: string;
  description: string;
  canonical?: string;
  openGraph: {
    title: string;
    type: string;
    images?: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    url: string;
    description: string;
    site_name: string;
    profile?: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
};

type LayoutProps = {
  head: HeadProps;

  dontRedirectUnverified?: boolean;
  redirectLogged?: boolean;
  redirectNotLogged?: boolean;
  children: React.ReactNode;
};

export type LoginContextType = {
  data: MeQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (() => Promise<ApolloQueryResult<MeQuery>>) | undefined;
};

export const LoginContext = React.createContext<LoginContextType>({
  data: undefined,
  loading: true,
  error: undefined,
  refetch: undefined,
});

const Layout: React.FC<LayoutProps> = ({
  head,
  dontRedirectUnverified,
  redirectLogged,
  redirectNotLogged,
  children,
}) => {
  const { data, loading, error, refetch } = useMeQuery();

  return (
    <LoginContext.Provider value={{ data, loading, error, refetch }}>
      <NextSeo
        title={head.title}
        description={head.description}
        canonical={head.canonical}
        openGraph={{
          ...head.openGraph,
          locale: 'en_US',
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'theme-color',
            content: '#17A6FA',
          },
          {
            name: 'keywords',
            content:
              'historical photos, old places, timeline, map, places history, Pardubice v běhu času, Pardubice history, history of place, social site, history places on map, map with timeline',
          },
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
        ]}
      />
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
      <div className="h-screen pt-16 bg-white dark:bg-[#171716]">
        {children}
      </div>
    </LoginContext.Provider>
  );
};

export default Layout;
