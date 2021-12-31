import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { NextSeo } from 'next-seo';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import { MeQuery, useMeQuery } from '../../lib/graphql/user.graphql';
import { orange_main } from '../../shared/colors';
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
            content: orange_main,
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
          {
            name: 'msapplication-TileColor',
            content: orange_main,
          },
          {
            name: 'msapplication-config',
            content: 'icons/browserconfig.xml',
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/icons/apple-touch-icon.png',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/icons/favicon-32x32.png',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/icons/favicon-16x16.png',
          },
          {
            rel: 'manifest',
            href: 'manifest.json',
          },
          {
            rel: 'mask-icon',
            href: '/icons/safari-pinned-tab.svg',
            color: orange_main,
          },
          {
            rel: 'shortcut icon',
            href: '/icons/favicon.ico',
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
